import { Timestamp } from 'firebase-admin/firestore';

export interface AgentToken {
  /** SHA-256 hash do token (usado como document ID) */
  token_hash: string;
  /** User ID do proprietário */
  uid: string;
  /** Label descritivo para identificar o token */
  label: string;
  /** Data de criação */
  created_at: Timestamp;
  /** Data de expiração (30 dias após criação) */
  expires_at: Timestamp;
  /** Data do último uso */
  last_used_at: Timestamp | null;
  /** Se o token foi revogado */
  revoked: boolean;
}

export interface AgentTokenListItem {
  /** SHA-256 hash do token (ID do documento) */
  token_hash: string;
  /** Label descritivo */
  label: string;
  /** Data de criação */
  created_at: Date;
  /** Data de expiração */
  expires_at: Date;
  /** Data do último uso */
  last_used_at: Date | null;
  /** Se o token foi revogado */
  revoked: boolean;
}

export interface CreateAgentTokenRequest {
  /** Label descritivo para o token */
  label: string;
}

export interface CreateAgentTokenResponse {
  /** Token gerado (exibido apenas uma vez) */
  token: string;
  /** Hash SHA-256 do token */
  token_hash: string;
  /** Label do token */
  label: string;
  /** Data de criação */
  created_at: Date;
  /** Data de expiração */
  expires_at: Date;
}

export interface RevokeAgentTokenRequest {
  /** Hash do token a ser revogado */
  token_hash: string;
}
