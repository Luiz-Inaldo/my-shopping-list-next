const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ezshoplist-ed2a0';

/**
 * Verificação leve de Firebase ID Token para Edge Runtime.
 * 
 * IMPORTANTE: Esta função NÃO verifica a assinatura do token!
 * Ela apenas valida:
 * - Formato JWT válido
 * - Issuer correto
 * - Audience correto
 * - Expiração
 * 
 * Esta função é edge-compatible e usada APENAS para decisões de roteamento
 * no middleware (proxy.ts). Para autenticação real em API routes (Node runtime),
 * use firebase-admin: adminAuth.verifyIdToken()
 * 
 * @param token - Firebase ID Token (JWT)
 * @returns DecodedToken com uid e outras claims, ou null se inválido
 */
export async function verifyFirebaseToken(
  token: string
): Promise<{ uid: string; [key: string]: any } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (!payload.sub) {
      return null;
    }

    if (payload.exp <= currentTime) {
      return null;
    }

    if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) {
      return null;
    }

    if (payload.aud !== FIREBASE_PROJECT_ID) {
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
 * NÃO verifica assinatura - use adminAuth.verifyIdToken() em API routes para verificação completa.
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
