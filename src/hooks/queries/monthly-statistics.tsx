import { queryOptions } from "@tanstack/react-query";
import { Filters } from "@/types/filters";
import { getPurchasesList } from "@/services/purchasesListServices";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { TMonthlyStatisticsResponse } from "@/types";

export function createMonthlyStatisticsQuery(userId: string | undefined, filters: Filters[]) {
  return queryOptions({
    queryKey: [QUERY_KEYS.monthlyStatistics, userId, filters],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data: purchases } = await getPurchasesList(userId, filters);
      if (!purchases || purchases.length === 0) return null;
      const serializedData = purchases.map((item) => ({
        ...item,
        start_date: item.start_date ? item.start_date.toDate().toISOString() : null,
        end_date: item.end_date ? item.end_date.toDate().toISOString() : null,
      }));
      return serializedData as TMonthlyStatisticsResponse;
    },
    enabled: !!userId,
  })
}