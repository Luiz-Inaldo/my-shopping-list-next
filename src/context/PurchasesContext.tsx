"use client";
import { IPuchasesContextProps, IPurchaseProps } from "@/types";
import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import useGeneralUserStore from "@/store/generalUserStore";
import { deletePurchaseFromDb, getActivePurchaseList } from "@/services/purchasesListServices";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const PurchasesContext = createContext<IPuchasesContextProps | undefined>(undefined);

export const PurchasesProvider = ({ children }: { children: React.ReactNode }) => {

    // ===============
    // # Store
    // ===============
    const userProfile = useGeneralUserStore(store => store.userProfile);

    // ===============
    // # States
    // ===============
    const [auxData, setAuxData] = useState<IPurchaseProps[]>([]);

    // ===============
    // # ReactQuery
    // ===============
    const {
        data: purchasesList,
        isLoading: loadingPurchasesList,
        isFetching: fetchingPurchasesList,
        isPending: pendingPurchasesList,
        error: errorFetchingPurchases,
        refetch: refetchPurchases,
    } = useQuery<IPurchaseProps[]>({
        queryKey: [QUERY_KEYS.activePurchases, userProfile?.uid],
        queryFn: async () => {
            const res = await getActivePurchaseList(userProfile?.uid as string);
            setAuxData(res.data as unknown as IPurchaseProps[]);
            return res.data as unknown as IPurchaseProps[];
        },
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: 60_000,
        enabled: !!userProfile?.uid
    });
    const queryClient = useQueryClient();

    const deletePurchase = async (purchaseId: string) => {
        try {
            await deletePurchaseFromDb(purchaseId);
            sendToastMessage({ title: "Compra deletada com sucesso!", type: "success" });
            queryClient.invalidateQueries({
                queryKey: ['activePurchases', userProfile?.uid]
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
                queryKey: [QUERY_KEYS.activePurchases, userProfile?.uid]
            });
        });
        return () => unsubscribe();
    }, [userProfile?.uid, queryClient]);

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
