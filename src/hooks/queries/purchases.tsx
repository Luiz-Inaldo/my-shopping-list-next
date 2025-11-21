import { QUERY_KEYS } from "@/constants/queryKeys";
import { getPurchasesList } from "@/services/purchasesListServices";
import useGeneralUserStore from "@/store/generalUserStore";
import { Filters } from "@/types/filters";
import { useQuery } from "@tanstack/react-query";

/**
 * @description Hook para buscar as compras inativas do usuário
 * @param {Filters[]} filters - Array de filtros
 * @param {boolean} enabledCondition - [Opcional] Condição para habilitar a query
 */
export function usePurchasesQuery(filters: Filters[], enabledCondition?: boolean) {
    const userProfile = useGeneralUserStore(store => store.userProfile);

    return useQuery({
        queryKey: [QUERY_KEYS.purchases, userProfile?.uid, filters],
        queryFn: async () => {
            const res = await getPurchasesList(userProfile?.uid as string, filters);
            return res.data;
        },
        enabled: enabledCondition || !!userProfile?.uid,
    });
}
