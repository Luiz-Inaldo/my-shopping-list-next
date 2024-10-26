import { supabase } from "@/lib/api";
import { IPuchasesContextProps, IPurchaseProps } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductsContext } from "./ProductsContext";

export const PurchasesContext = createContext<IPuchasesContextProps>({
    purchasesList: [],
    setPurchasesList: () => { },
    loading: false,
});

export const PurchasesProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useContext(ProductsContext)
    const [purchasesList, setPurchasesList] = useState<IPurchaseProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getPurchases = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("purchases").select("*").eq("user_id", user.id)

            if (error) {
                console.error(error);
            } else {
                setPurchasesList(data as IPurchaseProps[]);
            }
            setLoading(false);
        }
        getPurchases();
    }, [])

    return (
        <PurchasesContext.Provider value={{ purchasesList, setPurchasesList, loading }}>
            {children}
        </PurchasesContext.Provider>
    )
}
