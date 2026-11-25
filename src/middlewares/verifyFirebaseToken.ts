import { jwtVerify, createRemoteJWKSet } from 'jose';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ezshoplist-ed2a0';
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

// Cache do JWKS para reutilização
const jwks = createRemoteJWKSet(new URL(JWKS_URL));

/**
 * Verifica a assinatura e validade de um Firebase ID Token usando as chaves públicas do Google.
 * Esta função é edge-compatible e verifica:
 * - Assinatura válida (via JWKS)
 * - Issuer correto
 * - Audience correto
 * - Expiração
 * 
 * @param token - Firebase ID Token (JWT)
 * @returns DecodedToken com uid e outras claims, ou null se inválido
 */
export async function verifyFirebaseToken(
  token: string
): Promise<{ uid: string; [key: string]: any } | null> {
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    if (!payload.sub) {
      return null;
    }

    return {
      uid: payload.sub,
      ...payload,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Versão síncrona simplificada para verificação básica de expiração.
 * Usado como fallback quando verificação completa não é necessária.
 * NÃO verifica assinatura - use verifyFirebaseToken() para verificação completa.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp <= currentTime;
  } catch (error) {
    return true;
  }
}
