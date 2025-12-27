'use client'

import { APP_ROUTES } from '@/routes/app-routes'
import { Button } from '@/components/ui/button'
import { MailCheckIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { tryCatchRequest } from '@/functions/requests'
import { verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '@/lib/firebase'
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
        <div className="w-full min-h-screen-dvh flex flex-col items-center justify-center bg-app-background">
            {renderContent(mode)}
        </div>
    )
}
