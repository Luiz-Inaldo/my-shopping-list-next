// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ROUTES } from "./routes/app-routes";

/**
 * Verifica se o token do Firebase é válido e não expirado
 * @param token - Token do Firebase
 * @returns boolean - true se o token é válido, false caso contrário
 */
function isTokenValid(token: string): boolean {
  try {
    // Decodifica o token para verificar a expiração
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Verifica se o token não expirou (com margem de 5 minutos)
    return payload.exp > (currentTime + 300);
  } catch (error) {
    console.error('Erro ao verificar validade do token:', error);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  // Verifica se o token existe
  if (!token) {
    return NextResponse.redirect(new URL(APP_ROUTES.public.inicio.name, req.url));
  }

  // Verifica se o token é válido e não expirado
  if (!isTokenValid(token)) {
    // Token inválido ou expirado, remove o cookie e redireciona
    const response = NextResponse.redirect(new URL(APP_ROUTES.public.inicio.name, req.url));
    response.cookies.delete("authToken");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/historic/:path*", "/settings/:path*", "/estatisticas/:path*", "/menu/:path*", "/list/:path*"], // rotas privadas
};
