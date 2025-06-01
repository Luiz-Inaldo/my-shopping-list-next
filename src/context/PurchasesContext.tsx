import { supabase } from "@/lib/api";
import { IFilterProps, IPuchasesContextProps, IPurchaseProps } from "@/types";
import React, { createContext, useEffect, useState } from "react";
import useGeneralUserStore from "@/store/generalUserStore";

export const PurchasesContext = createContext<IPuchasesContextProps>({
    purchasesList: [],
    setPurchasesList: () => { },
    purchasesLoading: false,
    filterPurchases: async () => { }
});

export const PurchasesProvider = ({ children }: { children: React.ReactNode }) => {

    /**
     * ==========>> store <<===========
     */
    const user = useGeneralUserStore(store => store.user);

    /**
     * ==========>> states <<===========
     */
    const [purchasesList, setPurchasesList] = useState<IPurchaseProps[]>([]);
    const [purchasesLoading, setPurchasesLoading] = useState<boolean>(false);
    const [auxData, setAuxData] = useState<IPurchaseProps[]>([]);

    const getPurchases = async () => {
        setPurchasesLoading(true);
        const { data, error } = await supabase.from("purchases").select("*").eq("user_id", user?.id)

        if (error) {
            console.error(error);
        } else {
            setPurchasesList(data as IPurchaseProps[]);
            setAuxData(data as IPurchaseProps[]);
            setPurchasesLoading(false);
            return data as IPurchaseProps[];
        }

    }

    const filterPurchases = async (filter: IFilterProps) => {

        // if (purchasesList.length === 0) filterPurchases(filter);

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
                purchase.purchase_date.split("T")[0].split("-")[1] === String(month + 1).padStart(2, '0')
            );

            setPurchasesList(filteredData);

        }
        // terceiro caso: mês string e ano number
        else if (typeof month === 'string' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase =>
                purchase.purchase_date.split("T")[0].split("-")[0] === year.toString()
            );

            setPurchasesList(filteredData);

        }
        // quarto caso: mês number e ano string
        else if (typeof month === 'number' && typeof year === 'string') {

            const filteredData = auxData.filter(purchase =>
                purchase.purchase_date.split("T")[0].split("-")[1] === String(month + 1).padStart(2, '0')
            );

            setPurchasesList(filteredData);

        }
    }

    useEffect(() => {
        getPurchases();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <PurchasesContext.Provider value={{ purchasesList, setPurchasesList, purchasesLoading, filterPurchases }}>
            {children}
        </PurchasesContext.Provider>
    )
}
