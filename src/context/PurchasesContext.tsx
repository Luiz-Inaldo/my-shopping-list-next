"use client";
import { IFilterProps, IPuchasesContextProps, IPurchaseProps } from "@/types";
import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import useGeneralUserStore from "@/store/generalUserStore";
import { deletePurchaseFromDb, getPurchaseList } from "@/services/productsListServices";
import { TUiStates } from "@/types/uiStates";
import { sendToastMessage } from "@/functions/sendToastMessage";

const PurchasesContext = createContext<IPuchasesContextProps | undefined>(undefined);

export const PurchasesProvider = ({ children }: { children: React.ReactNode }) => {

    /**
     * ==========>> store <<===========
     */
    const userProfile = useGeneralUserStore(store => store.userProfile);

    /**
     * ==========>> states <<===========
     */
    const [purchasesList, setPurchasesList] = useState<IPurchaseProps[]>([]);
    const [uiStates, setUiStates] = useState<TUiStates>({ isLoading: true, hasError: false });
    const [auxData, setAuxData] = useState<IPurchaseProps[]>([]);

    const getPurchases = async () => {
        if (userProfile === null) return;
        setUiStates(prev => ({ ...prev, isLoading: true }));
        try {
            const res = await getPurchaseList(userProfile.uid);
            setPurchasesList(res.data as unknown as IPurchaseProps[]);
            setAuxData(res.data as unknown as IPurchaseProps[]);
        } catch (error) {
            console.error(error);
            setUiStates(prev => ({ ...prev, hasError: true }));
        } finally {
            setUiStates(prev => ({ ...prev, isLoading: false }));
        }
    }

    const deletePurchase = async (purchaseId: string) => {
        const res = await deletePurchaseFromDb(purchaseId);
        if (res.status === "success") {
            sendToastMessage({ title: "Compra deletada com sucesso!", type: "success" });
            refetchPurchases();
        } else {
            sendToastMessage({ title: "Erro ao deletar compra!", type: "error" });
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
                purchase.end_date.split("T")[0].split("-")[0] === year.toString() &&
                purchase.end_date.split("T")[0].split("-")[1] === String(month + 1).padStart(2, '0')
            );

            setPurchasesList(filteredData);

        }
        // terceiro caso: mês string e ano number
        else if (typeof month === 'string' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase =>
                purchase.end_date.split("T")[0].split("-")[0] === year.toString()
            );

            setPurchasesList(filteredData);

        }
        // quarto caso: mês number e ano string
        else if (typeof month === 'number' && typeof year === 'string') {

            const filteredData = auxData.filter(purchase =>
                purchase.end_date.split("T")[0].split("-")[1] === String(month + 1).padStart(2, '0')
            );

            setPurchasesList(filteredData);

        }
    };

    function refetchPurchases() {
        getPurchases();
    }

    useEffect(() => {
        getPurchases();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile]);

    return (
        <PurchasesContext.Provider value={{ purchasesList, setPurchasesList, uiStates, filterPurchases, refetchPurchases, deletePurchase }}>
            {children}
        </PurchasesContext.Provider>
    )
};

export function usePurchasesContext() {
    const context = useContext(PurchasesContext);
    if (context === undefined) {
        throw new Error("usePurchasesContext must be used within a PurchasesProvider");
    }
    return context as IPuchasesContextProps;
}
