import { QUERY_KEYS } from "@/constants/queryKeys";
import { invalidateAllQueries } from "@/functions/invalidadeQueries";
import {
  createAgentToken,
  listAgentTokens,
  revokeAgentToken,
} from "@/services/agentTokens";
import useGeneralUserStore from "@/store/generalUserStore";
import { useMutation, useQuery } from "@tanstack/react-query";

/** Lista os tokens de agentes do usuário logado. */
export function useAgentTokensQuery() {
  const uid = useGeneralUserStore((store) => store.userProfile?.uid);

  return useQuery({
    queryKey: [QUERY_KEYS.agentTokens, uid],
    queryFn: listAgentTokens,
    enabled: !!uid,
  });
}

export function useCreateAgentToken() {
  return useMutation({
    mutationFn: createAgentToken,
    onSuccess: () => invalidateAllQueries([[QUERY_KEYS.agentTokens]]),
  });
}

export function useRevokeAgentToken() {
  return useMutation({
    mutationFn: revokeAgentToken,
    onSuccess: () => invalidateAllQueries([[QUERY_KEYS.agentTokens]]),
  });
}
