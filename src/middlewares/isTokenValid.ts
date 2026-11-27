import { verifyFirebaseToken } from './verifyFirebaseToken';

/**
 * Verifica se o token do Firebase é válido para fins de roteamento no Edge Runtime.
 * 
 * IMPORTANTE - Modelo de Segurança:
 * Esta função roda no Edge Runtime (middleware) e NÃO verifica a assinatura criptográfica
 * do token. Ela apenas valida:
 * - Formato JWT válido
 * - Issuer e Audience corretos
 * - Expiração
 * 
 * Este nível de verificação é adequado para decisões de ROTEAMENTO (redirecionar para
 * login vs. permitir acesso à página), mas NÃO para AUTORIZAÇÃO de dados.
 * 
 * A verificação completa com assinatura criptográfica acontece nas API routes usando
 * firebase-admin: adminAuth.verifyIdToken() - que roda no Node runtime e pode fazer
 * verificação completa incluindo assinatura via JWKS.
 * 
 * @param token - Firebase ID Token (JWT)
 * @returns Promise<boolean> - true se o token é válido para roteamento, false caso contrário
 */
export async function isTokenValid(token: string): Promise<boolean> {
    try {
        const decoded = await verifyFirebaseToken(token);
        return decoded !== null;
    } catch (error) {
        console.error('Erro ao verificar validade do token:', error);
        return false;
    }
}