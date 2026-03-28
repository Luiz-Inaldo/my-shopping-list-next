// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ROUTES } from "./routes/app-routes";
import { applySecurityHeaders } from "./middlewares/securityHeaders";
import { isTokenValid } from "./middlewares/isTokenValid";


export async function proxy(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const url = req.nextUrl.pathname;

  // Define rotas públicas que não precisam de autenticação
  const publicRoutes = Object.values(APP_ROUTES.public).map(route => route.name);
  const isPublicRoute = publicRoutes.some(route => url.startsWith(route));

  // Se for uma rota pública, permite acesso sem verificação de token
  if (isPublicRoute) {
    // Se o usuário já está autenticado e tenta acessar rota pública, redireciona para home
    if (token && isTokenValid(token)) {
      return NextResponse.redirect(new URL(APP_ROUTES.private.home.name, req.url));
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // Para rotas privadas, verifica se o token existe
  if (!token) {
    return NextResponse.redirect(new URL(APP_ROUTES.public.inicio.name, req.url));
  }

  // Verifica se o token é válido e não expirado e se não é uma rota pública
  if (!isPublicRoute && !isTokenValid(token)) {
    // Token inválido ou expirado, remove o cookie e redireciona
    const response = NextResponse.redirect(new URL(APP_ROUTES.public.inicio.name, req.url));
    response.cookies.delete("authToken");
    return response;
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
