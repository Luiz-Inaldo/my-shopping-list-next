'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import VerifyEmailPage from './VerifyEmail'
import ResetPasswordPage from './ResetPassword'

export type ComponentStatus = 'idle' | 'loading' | 'success' | 'error';

export default function VerifierPage() {

    const params = useSearchParams();
    const mode = params.get('mode');

    const renderContent = (mode: string | null) => {
        switch (mode) {
            case 'verifyEmail':
            case 'recorverEmail':
                return <VerifyEmailPage />;
            case 'resetPassword':
                return <ResetPasswordPage />;

        }
    };

    return (
        <div
            className="auth-page-light flex min-h-screen w-full flex-col items-center p-4"
            style={{
                backgroundImage: "url('/images/food_background.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {renderContent(mode)}
        </div>
    )
}
