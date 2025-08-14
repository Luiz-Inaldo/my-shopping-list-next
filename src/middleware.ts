// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ROUTES } from "./routes/app-routes";

export async function middleware(req: NextRequest) {

  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL(APP_ROUTES.public.inicio.name, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/historic/:path*", "/settings/:path*", "/statistics/:path*", "/menu/:path*"], // rotas privadas
};
