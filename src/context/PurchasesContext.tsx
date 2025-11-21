"use client";
import { IPuchasesContextProps, IPurchaseProps } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import useGeneralUserStore from "@/store/generalUserStore";
import { deletePurchaseFromDb, } from "@/services/purchasesListServices";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Filters } from "@/types/filters";
import { queryClient } from "@/utils/queryClient";
import { usePurchasesQuery } from "@/hooks/queries/purchases";

const PurchasesContext = createContext<IPuchasesContextProps | undefined>(undefined);

export const PurchasesProvider = ({ children }: { children: React.ReactNode }) => {

    // ===============
    // # Store
    // ===============
    const userProfile = useGeneralUserStore(store => store.userProfile);

    // ===============
    // # States
    // ===============
    const [filters] = useState<Filters[]>([
        {
            id: "is_active",
            operator: "==",
            value: true
        }
    ]);

    // ===============
    // # ReactQuery
    // ===============
    const {
        data: purchasesList,
        isLoading: loadingPurchasesList,
        isFetching: fetchingPurchasesList,
        isPending: pendingPurchasesList,
        error: errorFetchingPurchases,
    } = usePurchasesQuery(filters);

    const deletePurchase = async (purchaseId: string) => {
        try {
            await deletePurchaseFromDb(purchaseId);
            sendToastMessage({ title: "Compra deletada com sucesso!", type: "success" });
            queryClient.invalidateQueries({
                queryKey: ['purchases', userProfile?.uid]
            });
            // refetchPurchases();
        } catch (error) {
            console.error(error);
            sendToastMessage({ title: "Erro ao deletar compra!", type: "error" });
        }
    }

    // ===============
    // # Effects
    // ===============
    useEffect(() => {
        const purchasesRef = collection(db, 'purchases');
        const unsubscribe = onSnapshot(purchasesRef, (snapshot) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.purchases, userProfile?.uid, filters]
            });
        });
        return () => unsubscribe();
    }, [filters, userProfile?.uid]);

    return (
        <PurchasesContext.Provider value={{ purchasesList, loadingPurchasesList, fetchingPurchasesList, pendingPurchasesList, errorFetchingPurchases, deletePurchase }}>
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
