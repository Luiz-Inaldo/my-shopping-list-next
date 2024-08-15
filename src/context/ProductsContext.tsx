"use client";
import { IProductsContextProps } from "@/types/contexts";
import { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/api";
import { IProductProps } from "@/types/product";
import { IEditItemProps } from "@/types/editItem";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export const ProductsContext = createContext<IProductsContextProps>({
    data: [],
    setData: () => { },
    loading: true,
    setLoading: () => { },
    optionMenu: null,
    setOptionMenu: () => { },
    editFormOpen: false,
    setEditFormOpen: () => { },
    fetchData: async () => { },
    formatNumber: () => '',
    handleUpdateItem: async () => { },
    handleDeleteItem: async () => { }
});

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {

    /* ====> states <==== */
    const [data, setData] = useState<IProductProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [optionMenu, setOptionMenu] = useState<number | null>(null);
    const [editFormOpen, setEditFormOpen] = useState<boolean>(false);

    /* ====> hooks <==== */
    const { toast } = useToast();

    /* ====> functions <==== */
    async function fetchData() {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error(error);
        } else {
            setData(data);
            setLoading(false);
        }
    }

    function formatNumber(value: string, quantity: number) {
        return (parseFloat(value.replace(',', '.')) * quantity).toString().replace('.', ',')
    }

    async function handleUpdateItem(object: IEditItemProps, itemID: number) {
        const {data, error} = await supabase.from('products').update(object).eq('id', itemID);

        if (error) {
            console.log(error);
        } else {
            toast({
                description: "Produto alterado com sucesso.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });
            fetchData();
            setTimeout(() => {
                setEditFormOpen(false);
            }, 1000)
        }
    }

    async function handleDeleteItem(itemID: number) {
        const { data, error } = await supabase.from('products').delete().eq('id', itemID);
        if (error) {
            console.log(error);
        } else {
            toast({
                description: "Produto removido da sua lista de compras.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });
            fetchData();
            setOptionMenu(null);
        }
    }

    /* ====> effects <==== */
    useEffect(() => {
        fetchData();
    }, [])

    return (
        <ProductsContext.Provider value={{
            data,
            setData,
            loading,
            setLoading,
            optionMenu,
            setOptionMenu,
            editFormOpen,
            setEditFormOpen,
            fetchData,
            formatNumber,
            handleUpdateItem,
            handleDeleteItem
        }}>
            {children}
        </ProductsContext.Provider>
    )
}
