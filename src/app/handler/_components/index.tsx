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
        <div className="w-full min-h-screen-dvh flex flex-col items-center bg-app-background p-2 pt-6">
            {renderContent(mode)}
        </div>
    )
}
