"use client";
import { IProductsContextProps } from "@/types/contexts";
import { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/api";
import { IProductProps } from "@/types/product";

export const ProductsContext = createContext<IProductsContextProps>({
    data: [],
    setData: () => { },
    loading: true,
    setLoading: () => { },
    fetchData: async () => { },
    formatNumber: () => ''
});

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {

    /* ====> states <==== */
    const [data, setData] = useState<IProductProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
            fetchData,
            formatNumber
        }}>
            {children}
        </ProductsContext.Provider>
    )
}
