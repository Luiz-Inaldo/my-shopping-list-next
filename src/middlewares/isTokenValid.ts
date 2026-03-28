/**
 * Verifica se o token do Firebase é válido e não expirado
 * @param token - Token do Firebase
 * @returns boolean - true se o token é válido, false caso contrário
 */
export function isTokenValid(token: string): boolean {
    try {
        // Decodifica o token para verificar a expiração
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        // Verifica se o token não expirou (com margem de 50 minutos)
        return payload.exp > (currentTime + 3000);
    } catch (error) {
        console.error('Erro ao verificar validade do token:', error);
        return false;
    }
}