import { supabase } from "@/lib/api";
import { IFilterProps, IPuchasesContextProps, IPurchaseProps } from "@/types";
import React, { createContext, use, useContext, useEffect, useState } from "react";
import { ProductsContext } from "./ProductsContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const PurchasesContext = createContext<IPuchasesContextProps>({
    purchasesList: [],
    purchasesLoading: false,
    filterPurchases: async () => { }
});

export const PurchasesProvider = ({ children }: { children: React.ReactNode }) => {

    const { user } = useContext(ProductsContext);
    const [auxData, setAuxData] = useState<IPurchaseProps[]>([]);
    const queryClient = useQueryClient();

    const getPurchases = async () => {

        const { data, error } = await supabase.from("purchases").select("*").eq("user_id", user.id)

        if (error) {
            console.error(error);
        } else {
            // setPurchasesList(data as IPurchaseProps[]);
            setAuxData(data as IPurchaseProps[]);
            return data as IPurchaseProps[];
        }

    }

    const { data: purchasesList, isLoading: purchasesLoading, refetch: refetchPurchases } = useQuery({
        queryKey: ["purchases"],
        queryFn: getPurchases,
        refetchOnWindowFocus: false
    })

    const filterPurchases = async (filter: IFilterProps) => {

        const month = filter.month;
        const year = filter.year;

        // primeiro caso: os dois parâmetros são string
        if (typeof month === "string" && typeof year === "string") {
            // setPurchasesList(auxData);
            queryClient.setQueryData(["purchases"], auxData);
        }
        // segundo caso: ambos parâmetros number
        else if (typeof month === 'number' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase => 
                purchase.purchase_date.split("T")[0].split("-")[0] === year.toString() &&
                purchase.purchase_date.split("T")[0].split("-")[1] === (month + 1).toString()
            );

            queryClient.setQueryData(["purchases"], filteredData);

        }
        // terceiro caso: mês string e ano number
        else if (typeof month === 'string' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase => 
                purchase.purchase_date.split("T")[0].split("-")[0] === year.toString()
            );

            console.log(filteredData);

            queryClient.setQueryData(["purchases"], filteredData);

        }
        // quarto caso: mês number e ano string
        else if (typeof month === 'number' && typeof year === 'string') {

            const filteredData = auxData.filter(purchase => 
                purchase.purchase_date.split("T")[0].split("-")[1] === (month + 1).toString()
            );

            queryClient.setQueryData(["purchases"], filteredData);

        }
    }

    useEffect(() => {
        getPurchases();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <PurchasesContext.Provider value={{ purchasesList, purchasesLoading, filterPurchases }}>
            {children}
        </PurchasesContext.Provider>
    )
}
