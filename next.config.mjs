/** @type {import('next').NextConfig} */
const nextConfig = {
  // Externalizar firebase-admin para evitar problemas de bundling
  // O firebase-admin deve rodar como módulo Node nativo, não ser bundled pelo Turbopack
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
