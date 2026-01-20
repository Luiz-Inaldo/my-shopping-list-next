import { QUERY_KEYS } from "@/constants/queryKeys";
import { getMonthlyStatistics } from "@/functions/monthlyStatisticsAction";
import { queryOptions } from "@tanstack/react-query";

export function createQueryOptionsMonthlyStatistics(userId: string | undefined) {
    return queryOptions({
        queryKey: [QUERY_KEYS.monthlyStatistics, userId],
        queryFn: async () => {
            if (!userId) {
                return null;
            }
            const aiResponse = await getMonthlyStatistics(userId);
            return aiResponse;
        },
        enabled: !!userId,
    })
}