import { verifyFirebaseToken } from './verifyFirebaseToken';

/**
 * Verifica se o token do Firebase é válido (assinatura + expiração).
 * Esta função verifica a assinatura do token usando as chaves públicas do Google.
 * 
 * @param token - Token do Firebase
 * @returns Promise<boolean> - true se o token é válido, false caso contrário
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