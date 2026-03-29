// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { loginToken, userToken } = await request.json();
    const urlRedirect = new URL(`/auth/login/google/user-info/${userToken}`, request.url);
    (await cookies()).set('authToken', loginToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400,
        path: '/'
    });

    return NextResponse.json({
        success: true,
        redirectUrl: urlRedirect.toString()
    });
}