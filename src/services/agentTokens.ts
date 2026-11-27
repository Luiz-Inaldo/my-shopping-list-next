import { auth } from "@/lib/firebase";
import type {
  AgentTokenListItem,
  CreateAgentTokenResponse,
} from "@/types/agentToken";

const AGENT_TOKENS_ENDPOINT = "/api/agent-tokens";

async function getIdToken(): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Erro ao obter autenticação");
  return currentUser.getIdToken();
}

async function authorizedFetch<T>(
  init: { method?: string; body?: unknown } = {}
): Promise<T> {
  const idToken = await getIdToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${idToken}`,
  };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(AGENT_TOKENS_ENDPOINT, {
    method: init.method,
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

/** Lista os tokens de agentes do usuário autenticado. */
export async function listAgentTokens(): Promise<AgentTokenListItem[]> {
  const data = await authorizedFetch<{ tokens: AgentTokenListItem[] }>();
  return data.tokens;
}

/** Cria um novo token de agente. */
export function createAgentToken(
  label: string
): Promise<CreateAgentTokenResponse> {
  return authorizedFetch<CreateAgentTokenResponse>({
    method: "POST",
    body: { label },
  });
}

/** Revoga um token de agente pelo hash. */
export function revokeAgentToken(
  tokenHash: string
): Promise<{ success: boolean }> {
  return authorizedFetch<{ success: boolean }>({
    method: "DELETE",
    body: { token_hash: tokenHash },
  });
}
