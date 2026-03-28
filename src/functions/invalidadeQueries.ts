import { queryClient } from "@/utils/queryClient";

export function invalidateAllQueries(queries: any[]) {
    queries.forEach(query => {
        queryClient.invalidateQueries({ queryKey: query });
    });
}