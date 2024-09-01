
import { IProductsContextProps } from "@/types/contexts";
import { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/api";
import { IProductProps } from "@/types/product";
import { IEditItemProps } from "@/types/editItem";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Query, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const ProductsContext = createContext<IProductsContextProps>({
    user: {},
    setUser: () => { },
    // data: [],
    // loading: true,
    // setLoading: () => { },
    // isPending: false,
    modal: {
        state: 'CLOSED',
        type: ''
    },
    setModal: () => { },
    optionMenu: null,
    setOptionMenu: () => { },
    totalValue: '0',
    setTotalValue: () => { },
    stipulatedValue: 'não definido',
    setStipulatedValue: () => { },
    situation: 'good',
    setSituation: () => { },
    formatNumber: () => '',
    addItem: async () => { },
    fetchData: async () => [],
    deleteAllItems: async () => { },
    handleUpdateItem: async () => { },
    handleDeleteItem: async () => { },
    handleCheckItem: async () => { },
    handleDismarkItem: async () => { }
});

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {

    const queryClientClass = new QueryClient();

    /* ====> states <==== */
    const [user, setUser] = useState<any>(null);
    const [modal, setModal] = useState<any>({
        state: 'CLOSED',
        type: ''
    })
    const [optionMenu, setOptionMenu] = useState<number | null>(null);
    const [totalValue, setTotalValue] = useState<string>('0');
    const [stipulatedValue, setStipulatedValue] = useState<string>('não definido');
    const [situation, setSituation] = useState<string>('good');

    /* ====> hooks <==== */
    const { toast } = useToast();

    /* ====> functions <==== */
    async function fetchData(): Promise<IProductProps[] | undefined> {
        if (user === null) return [];

        const { data, error } = await supabase.from('products').select('*').eq('user_id', user.id);
        if (error) {
            console.error(error);
        } else {
            return data;
        }
    }

    function formatNumber(value: string, quantity: number) {
        return (parseFloat(value.replace(',', '.')) * quantity).toFixed(2).replace('.', ',')
    }

    async function addItem(item: any) {
        try {

            const response = await supabase.from('products').insert([item]).select();

            if (response.status === 201) {

                toast({
                    description: "Produto adicionado com sucesso.",
                    action: <ToastAction altText="Ok">Ok</ToastAction>
                });

            } else {

            }

        } catch (error) {
            console.log(error)
        }
    }

    async function deleteAllItems() {

        try {

            const { error } = await supabase.from('products').delete().eq('user_id', user.id);

            if (error) {
                console.log(error);
                return
            }

            toast({
                description: "Lista de compras resetada com sucesso.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });

        } catch (error) {
            console.log(error)
        }

        fetchData();

    }

    async function handleUpdateItem(object: IEditItemProps, itemID: number) {
        const { data, error } = await supabase.from('products').update(object).eq('id', itemID);

        if (error) {
            console.log(error);
        } else {
            toast({
                description: "Produto alterado com sucesso.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });
            fetchData();
            setTimeout(() => {
                setModal({
                    state: 'CLOSED',
                    type: ''
                });
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

    async function handleCheckItem(item: IProductProps, object?: IEditItemProps) {

        const editedItem = {
            ...item,
            value: object?.value ? object.value : item.value,
            checked: !item.checked
        }

        const { data, error } = await supabase.from('products').update(editedItem).eq('id', item.id);
        if (error) {
            console.log(error);
        } else {
            toast({
                description: "Produto marcado como adiquirido.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });
            fetchData();
            setModal({
                state: 'CLOSED',
                type: ''
            });
        }
    }

    async function handleDismarkItem(item: IProductProps) {

        const editedItem = {
            ...item,
            checked: !item.checked
        }

        const { data, error } = await supabase.from('products').update(editedItem).eq('id', item.id);

        if (error) {
            console.log(error);
        } else {
            fetchData();
        }

    }

    /* ====> effects <==== */
    useEffect(() => {
        fetchData();
    }, [user]);

    

    useEffect(() => {

        if (!localStorage.getItem('STIPULATED_VALUE')) {
            setModal({
                state: 'OPEN',
                type: 'LIMIT_VALUE'
            });
        } else {
            const value = JSON.parse(localStorage.getItem('STIPULATED_VALUE') || 'não definido');
            setStipulatedValue(value);
        }

    }, []);

    useEffect(() => {

        if (stipulatedValue === 'não definido') return;

        const parsedTotal = parseFloat(totalValue.replace(',', '.'));
        const parsedStipulated = parseFloat(stipulatedValue.replace(',', '.'));

        if (parsedTotal < (parsedStipulated * 0.8)) {
            setSituation('good');
        }

        if (parsedTotal >= (parsedStipulated * 0.8) && parsedTotal < parsedStipulated) {
            setSituation('normal');
        }

        if (parsedTotal >= parsedStipulated) {
            setSituation('bad');
        }


    }, [totalValue])

    return (
        <ProductsContext.Provider value={{
            user,
            setUser,
            // data,
            // setData,
            // loading,
            // setLoading,
            // isPending,
            modal,
            setModal,
            optionMenu,
            setOptionMenu,
            totalValue,
            setTotalValue,
            stipulatedValue,
            setStipulatedValue,
            situation,
            setSituation,

            fetchData,
            addItem,
            formatNumber,
            deleteAllItems,
            handleUpdateItem,
            handleDeleteItem,
            handleCheckItem,
            handleDismarkItem
        }}>
            <QueryClientProvider client={queryClientClass}>
                {children}
            </QueryClientProvider>
        </ProductsContext.Provider>
    )
}
