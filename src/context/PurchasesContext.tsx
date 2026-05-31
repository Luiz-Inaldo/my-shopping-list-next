"use client";
import { IPuchasesContextProps } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import useGeneralUserStore from "@/store/generalUserStore";
import {
  deletePurchaseFromDb,
  unlinkUserFromSharedPurchase,
} from "@/services/purchasesListServices";
import { tryCatchRequest } from "@/functions/requests";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Filters } from "@/types/filters";
import { queryClient } from "@/utils/queryClient";
import { usePurchasesQuery } from "@/hooks/queries/purchases";

export const PurchasesContext = createContext<IPuchasesContextProps | undefined>(
  undefined
);

const ACTIVE_FILTERS: Filters[] = [
  {
    id: "is_active",
    operator: "==",
    value: true,
  },
];

function invalidatePurchasesQueries(uid: string | undefined) {
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.purchases, uid],
  });
}

export const PurchasesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userProfile = useGeneralUserStore((store) => store.userProfile);

  const {
    data: purchasesList,
    isLoading: loadingPurchasesList,
    isFetching: fetchingPurchasesList,
    isPending: pendingPurchasesList,
    error: errorFetchingPurchases,
  } = usePurchasesQuery(ACTIVE_FILTERS, "owned");

  const {
    data: sharedPurchasesList,
    isLoading: loadingSharedPurchasesList,
    isFetching: fetchingSharedPurchasesList,
    isPending: pendingSharedPurchasesList,
    error: errorFetchingSharedPurchases,
  } = usePurchasesQuery(ACTIVE_FILTERS, "shared");

  const deletePurchase = async (purchaseId: string) => {
    const [, error] = await tryCatchRequest<void, Error>(() =>
      deletePurchaseFromDb(purchaseId)
    );

    if (error) {
      console.error(error);
      sendToastMessage({ title: "Erro ao deletar compra!", type: "error" });
      return;
    }

    sendToastMessage({
      title: "Compra deletada com sucesso!",
      type: "success",
    });
    invalidatePurchasesQueries(userProfile?.uid);
  };

  const unlinkSharedPurchase = async (purchaseId: string) => {
    if (!userProfile?.uid) return;

    const [, error] = await tryCatchRequest<void, Error>(() =>
      unlinkUserFromSharedPurchase(purchaseId, userProfile.uid)
    );

    if (error) {
      console.error(error);
      sendToastMessage({
        title: "Erro ao desvincular lista!",
        type: "error",
      });
      return;
    }

    sendToastMessage({
      title: "Lista desvinculada com sucesso!",
      type: "success",
    });
    invalidatePurchasesQueries(userProfile.uid);
  };

  useEffect(() => {
    const purchasesRef = collection(db, "purchases");
    const unsubscribe = onSnapshot(purchasesRef, () => {
      invalidatePurchasesQueries(userProfile?.uid);
    });
    return () => unsubscribe();
  }, [userProfile?.uid]);

  return (
    <PurchasesContext.Provider
      value={{
        purchasesList,
        loadingPurchasesList,
        fetchingPurchasesList,
        pendingPurchasesList,
        errorFetchingPurchases,
        sharedPurchasesList,
        loadingSharedPurchasesList,
        fetchingSharedPurchasesList,
        pendingSharedPurchasesList,
        errorFetchingSharedPurchases,
        deletePurchase,
        unlinkSharedPurchase,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

export function usePurchasesContext() {
  const context = useContext(PurchasesContext);
  if (context === undefined) {
    throw new Error("usePurchasesContext must be used within a PurchasesProvider");
  }
  return context as IPuchasesContextProps;
}
