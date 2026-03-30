export function generateToken(tamanho = 32) {
    const buffer = new Uint8Array(tamanho);
    crypto.getRandomValues(buffer);
    return Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('');
}