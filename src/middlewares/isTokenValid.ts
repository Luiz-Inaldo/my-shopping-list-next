/**
 * Verifica se o token do Firebase é válido e não expirado
 * IMPORTANTE: Esta função apenas verifica a expiração básica do token.
 * Para verificação completa com assinatura, use verifyFirebaseToken() do Firebase Admin SDK.
 * 
 * Esta função é usada no middleware edge que não suporta Firebase Admin.
 * Para rotas de API (Node.js runtime), sempre use adminAuth.verifyIdToken().
 * 
 * @param token - Token do Firebase
 * @returns boolean - true se o token aparenta ser válido (expiração), false caso contrário
 */
export function isTokenValid(token: string): boolean {
    try {
        // Decodifica o token para verificar a expiração
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        // Verifica se o token não expirou (com margem de 50 minutos)
        // NOTA: Isto não verifica a assinatura! Use adminAuth.verifyIdToken() em rotas API.
        return payload.exp > (currentTime + 3000);
    } catch (error) {
        console.error('Erro ao verificar validade do token:', error);
        return false;
    }
}