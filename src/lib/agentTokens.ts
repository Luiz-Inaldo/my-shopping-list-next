import { randomBytes, createHash } from 'crypto';
import { adminDb } from './firebaseAdmin';
import { AgentToken, AgentTokenListItem } from '@/types/agentToken';
import { Timestamp } from 'firebase-admin/firestore';

const TOKEN_VALIDITY_DAYS = 30;
const MAX_TOKENS_PER_USER = 3;

/**
 * Gera um token aleatório seguro (32 bytes = 64 chars hex)
 */
export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Calcula o hash SHA-256 de um token
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Conta quantos tokens ativos um usuário possui
 */
export async function countActiveTokens(uid: string): Promise<number> {
  const snapshot = await adminDb
    .collection('agent_tokens')
    .where('uid', '==', uid)
    .where('revoked', '==', false)
    .get();

  const now = Timestamp.now();
  
  // Contar apenas tokens não expirados
  return snapshot.docs.filter((doc: any) => {
    const data = doc.data() as AgentToken;
    return data.expires_at.toMillis() > now.toMillis();
  }).length;
}

/**
 * Cria um novo token no Firestore
 */
export async function createAgentToken(
  uid: string,
  label: string
): Promise<{ token: string; tokenHash: string; expiresAt: Date }> {
  // Verificar limite de tokens
  const activeCount = await countActiveTokens(uid);
  if (activeCount >= MAX_TOKENS_PER_USER) {
    throw new Error(
      `Limite de ${MAX_TOKENS_PER_USER} tokens ativos atingido. Revogue um token existente antes de criar um novo.`
    );
  }

  const token = generateToken();
  const tokenHash = hashToken(token);
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(
    now.toMillis() + TOKEN_VALIDITY_DAYS * 24 * 60 * 60 * 1000
  );

  const tokenDoc: AgentToken = {
    token_hash: tokenHash,
    uid,
    label,
    created_at: now,
    expires_at: expiresAt,
    last_used_at: null,
    revoked: false,
  };

  await adminDb.collection('agent_tokens').doc(tokenHash).set(tokenDoc);

  return {
    token,
    tokenHash,
    expiresAt: expiresAt.toDate(),
  };
}

/**
 * Lista todos os tokens de um usuário
 */
export async function listUserTokens(uid: string): Promise<AgentTokenListItem[]> {
  const snapshot = await adminDb
    .collection('agent_tokens')
    .where('uid', '==', uid)
    .orderBy('created_at', 'desc')
    .get();

  return snapshot.docs.map((doc: any) => {
    const data = doc.data() as AgentToken;
    return {
      token_hash: doc.id,
      label: data.label,
      created_at: data.created_at.toDate(),
      expires_at: data.expires_at.toDate(),
      last_used_at: data.last_used_at?.toDate() || null,
      revoked: data.revoked,
    };
  });
}

/**
 * Revoga um token
 */
export async function revokeAgentToken(uid: string, tokenHash: string): Promise<void> {
  const docRef = adminDb.collection('agent_tokens').doc(tokenHash);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Token não encontrado');
  }

  const data = doc.data() as AgentToken;
  if (data.uid !== uid) {
    throw new Error('Token não pertence ao usuário');
  }

  await docRef.update({ revoked: true });
}

/**
 * Valida e retorna o UID associado a um token
 * Atualiza last_used_at se o token for válido
 */
export async function validateAgentToken(token: string): Promise<string | null> {
  const tokenHash = hashToken(token);
  const docRef = adminDb.collection('agent_tokens').doc(tokenHash);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data() as AgentToken;

  // Verificar se está revogado
  if (data.revoked) {
    return null;
  }

  // Verificar expiração
  const now = Timestamp.now();
  if (data.expires_at.toMillis() <= now.toMillis()) {
    return null;
  }

  // Atualizar last_used_at (não aguardar para não bloquear)
  docRef.update({ last_used_at: now }).catch(console.error);

  return data.uid;
}
