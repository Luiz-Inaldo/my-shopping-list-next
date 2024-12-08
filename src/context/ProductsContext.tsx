"use client";
import { IProductsContextProps, ISupabasePurchaseProps } from "@/types";
import { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/api";
import { IProductProps } from "@/types";
import { IEditItemProps } from "@/types";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export const ProductsContext = createContext<IProductsContextProps>({
    user: {},
    setUser: () => { },
    data: [],
    setData: () => { },
    loading: true,
    setLoading: () => { },
    modal: {
        state: 'CLOSED',
        type: null
    },
    setModal: () => { },
    optionMenu: null,
    setOptionMenu: () => { },
    totalValue: '0',
    setTotalValue: () => { },
    situation: 'good',
    setSituation: () => { },
    currentPurchase: null,
    setCurrentPurchase: () => { },

    fetchData: async () => { },
    fetchPurchaseData: async () => { },
    deleteCurrentPurchase: async () => { },
    deleteAllItems: async () => { },
    handleUpdateItem: async () => { },
    handleDeleteItem: async () => { },
    handleCheckItem: async () => { },
    handleDismarkItem: async () => { }
});

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {

    /* ====> states <==== */
    const [user, setUser] = useState<any>(null);
    const [data, setData] = useState<IProductProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modal, setModal] = useState<any>({
        state: 'CLOSED',
        type: null
    })
    const [optionMenu, setOptionMenu] = useState<string | null>(null);
    const [totalValue, setTotalValue] = useState<string>('0');
    const [situation, setSituation] = useState<string>('good');
    const [currentPurchase, setCurrentPurchase] = useState<ISupabasePurchaseProps | null>(null);

    /* ====> hooks <==== */
    const { toast } = useToast();

    /* ====> functions <==== */
    async function fetchData() {
        if (user === null) return;

        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').eq('user_id', user.id);
        if (error) {
            console.error(error);
        } else {
            setData(data);
            setLoading(false);
        }
    }

    async function fetchPurchaseData() {
        if (user === null) return;
        const { data, error } = await supabase.from('active_purchases').select('*').eq("user_id", user.id);
        if (error) {
            console.error(error)
            return;
        }
        setCurrentPurchase(data.length > 0 ? data[0] : null);
    }

    function caculateTotalValue() {

        let total: number = 0;
        const checkedItems = data.filter(product => product.checked === true);
        checkedItems.forEach(item => {
            const parsedTotal = (parseFloat(item.value.replace(',', '.')) * item.quantity);
            total += parsedTotal;
        })
        setTotalValue(total.toFixed(2).replace('.', ','))

    }

    async function deleteAllItems() {

        try {

            const { error } = await supabase.from('products').delete().eq('user_id', user.id);

            if (error) {
                console.log(error);
                return
            }

        } catch (error) {
            console.log(error)
        }

        fetchData();

    }

    async function deleteCurrentPurchase() {
        const { error } = await supabase.from('active_purchases').delete().eq('user_id', user.id);

        if (error) {
            console.log(error);
            return;
        }

        fetchPurchaseData();

    }

    async function handleUpdateItem(object: IEditItemProps, itemID: string) {
        const { data, error } = await supabase.from('products').update(object).eq('id', itemID);

        if (error) {
            console.log(error);
        } else {
            toast({
                description: "Produto alterado com sucesso.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });
            // fetchData();
            setData((oldData) => {
                return oldData.map(product => {
                    if (product.id === itemID) {
                        return { ...product, name: object.name, quantity: object.quantity, value: object.value };
                    }
                    return product;
                });
            })
            setTimeout(() => {
                setModal({
                    state: 'CLOSED',
                    type: null
                });
            }, 1000)
        }
    }

    async function handleDeleteItem(itemID: string) {
        const { data, error } = await supabase.from('products').delete().eq('id', itemID);
        if (error) {
            console.log(error);
        } else {
            toast({
                description: "Produto removido da sua lista de compras.",
                action: <ToastAction altText="Ok">Ok</ToastAction>
            });
            setData((oldData) => {
                return oldData.filter(item => item.id !== itemID);
            })
            setOptionMenu(null);
            setTimeout(() => {
                setModal({
                    state: 'CLOSED',
                    type: null
                });
            }, 1000)
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
            setData((oldData) => {
                return oldData.map(product => {
                    if (product.id === item.id) {
                        return {
                            ...product,
                            value: object?.value ? object.value : item.value,
                            checked: !item.checked
                        };
                    }
                    return product;
                });
            })
            setModal({
                state: 'CLOSED',
                type: null
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
            setData((oldData) => {
                return oldData.map(product => {
                    if (product.id === item.id) {
                        return { ...product, checked: !item.checked };
                    }
                    return product;
                });
            })
        }

    }

    /* ====> effects <==== */
    useEffect(() => {
        fetchData();
        fetchPurchaseData();
    }, [user]);

    useEffect(() => {
        caculateTotalValue();
    }, [data]);

    useEffect(() => {

        if (currentPurchase) {
            const parsedTotal = parseFloat(totalValue.replace(',', '.'));
            const parsedMaxValue = parseFloat(currentPurchase?.list_max_value.replace(',', '.'));

            if (parsedTotal < (parsedMaxValue * 0.8)) {
                setSituation('good');
            }

            if (parsedTotal >= (parsedMaxValue * 0.8) && parsedTotal < parsedMaxValue) {
                setSituation('normal');
            }

            if (parsedTotal >= parsedMaxValue) {
                setSituation('bad');
            }
        }

    }, [totalValue]);

    return (
        <ProductsContext.Provider value={{
            user,
            setUser,
            data,
            setData,
            loading,
            setLoading,
            modal,
            setModal,
            optionMenu,
            setOptionMenu,
            totalValue,
            setTotalValue,
            currentPurchase,
            setCurrentPurchase,
            situation,
            setSituation,

            fetchData,
            fetchPurchaseData,
            deleteCurrentPurchase,
            deleteAllItems,
            handleUpdateItem,
            handleDeleteItem,
            handleCheckItem,
            handleDismarkItem
        }}>
            {children}
        </ProductsContext.Provider>
    )
}
