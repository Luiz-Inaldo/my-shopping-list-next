import { supabase } from "@/lib/api";
import { IFilterProps, IPuchasesContextProps, IPurchaseProps } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductsContext } from "./ProductsContext";

export const PurchasesContext = createContext<IPuchasesContextProps>({
    purchasesList: [],
    setPurchasesList: () => { },
    loading: false,
    filterPurchases: async () => { }
});

export const PurchasesProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useContext(ProductsContext)
    const [purchasesList, setPurchasesList] = useState<IPurchaseProps[]>([]);
    const [auxData, setAuxData] = useState<IPurchaseProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getPurchases = async () => {

        const { data, error } = await supabase.from("purchases").select("*").eq("user_id", user.id)

        if (error) {
            console.error(error);
        } else {
            setPurchasesList(data as IPurchaseProps[]);
            setAuxData(data as IPurchaseProps[]);
        }

        setLoading(false);
    }

    const filterPurchases = async (filter: IFilterProps) => {

        const month = filter.month;
        const year = filter.year;

        // primeiro caso: os dois parâmetros são string
        if (typeof month === "string" && typeof year === "string") {
            setPurchasesList(auxData);
        }
        // segundo caso: ambos parâmetros number
        else if (typeof month === 'number' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase => 
                purchase.purchase_date.split("T")[0].split("-")[0] === year.toString() &&
                purchase.purchase_date.split("T")[0].split("-")[1] === (month + 1).toString()
            );

            setPurchasesList(filteredData);

        }
        // terceiro caso: mês string e ano number
        else if (typeof month === 'string' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase => 
                purchase.purchase_date.split("T")[0].split("-")[0] === year.toString()
            );

            console.log(filteredData);

            setPurchasesList(filteredData);

        }
        // quarto caso: mês number e ano string
        else if (typeof month === 'number' && typeof year === 'string') {

            const filteredData = auxData.filter(purchase => 
                purchase.purchase_date.split("T")[0].split("-")[1] === (month + 1).toString()
            );

            setPurchasesList(filteredData);

        }
    }

    useEffect(() => {
        getPurchases();
    }, [])

    return (
        <PurchasesContext.Provider value={{ purchasesList, setPurchasesList, loading, filterPurchases }}>
            {children}
        </PurchasesContext.Provider>
    )
}
