import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getPurchasesList,
  getSharedPurchasesList,
} from "@/services/purchasesListServices";
import useGeneralUserStore from "@/store/generalUserStore";
import { Filters } from "@/types/filters";
import { useQuery } from "@tanstack/react-query";

export type PurchasesQueryScope = "owned" | "shared";

export function getPurchasesQueryKey(
  uid: string | undefined,
  filters: Filters[],
  scope: PurchasesQueryScope = "owned"
) {
  return [QUERY_KEYS.purchases, uid, scope, filters] as const;
}

/**
 * @description Hook para buscar compras do usuário (criadas ou compartilhadas)
 * @param filters - Array de filtros Firestore
 * @param scope - `owned` listas criadas; `shared` listas compartilhadas com o usuário
 * @param enabledCondition - [Opcional] Condição para habilitar a query
 */
export function usePurchasesQuery(
  filters: Filters[],
  scope: PurchasesQueryScope = "owned",
  enabledCondition?: boolean
) {
  const userProfile = useGeneralUserStore((store) => store.userProfile);

  return useQuery({
    queryKey: getPurchasesQueryKey(userProfile?.uid, filters, scope),
    queryFn: async () => {
      const uid = userProfile?.uid as string;
      const res =
        scope === "shared"
          ? await getSharedPurchasesList(uid, filters)
          : await getPurchasesList(uid, filters);
      return res.data;
    },
    enabled: enabledCondition ?? !!userProfile?.uid,
  });
}
