import { QUERY_KEYS } from "@/constants/queryKeys";
import { getUsernamesList } from "@/services/usernames";
import { queryOptions } from "@tanstack/react-query";

export function createUsernameQueryOptions() {
    return queryOptions({
        queryKey: [QUERY_KEYS.usernames],
        queryFn: async () => {
            const res = await getUsernamesList();
            return res;
        }
    })
}