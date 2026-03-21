'use client'

import { APP_ROUTES } from '@/routes/app-routes'
import { Button } from '@/components/ui/button'
import { AlertCircle, Check, MailCheckIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { tryCatchRequest } from '@/functions/requests'
import { applyActionCode } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AppLoader } from '@/components/Loader/app-loader'
import { ComponentStatus } from '.'

export default function VerifyEmailPage() {

    const params = useSearchParams();
    const router = useRouter();
    const mode = params.get('mode');
    const code = params.get('oobCode');

    const [status, setStatus] = useState<ComponentStatus>('idle');

    async function onVerifyEmail() {
        let timeout: NodeJS.Timeout;
        setStatus('loading');
        const [_, error] = await tryCatchRequest(applyActionCode(auth, code || ''))
        if (error) {
            setStatus('error');
            return;
        }
        setStatus('success');
        timeout = setTimeout(() => {
            router.push(APP_ROUTES.public.login.name);
        }, 2_000);
        return () => clearTimeout(timeout);
    }

    const containerClass = "rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-6 shadow-sketch flex items-center gap-4 w-full max-w-[400px]"

    const renderContent = (mode: string | null, componentStatus: ComponentStatus) => {
        const isEmailVerification = mode === 'verifyEmail';

        switch (componentStatus) {
            case 'idle':
                return (
                    <div className="rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-6 shadow-sketch flex flex-col w-full max-w-[400px]">
                        <h1 className="font-sketchHeading text-title text-left text-xl font-bold">
                            {isEmailVerification ? "Confirmação" : "Alteração"} de e-mail
                        </h1>
                        <p className="font-sketch text-paragraph text-sm">Clique no botão abaixo para {isEmailVerification ? "validar" : "alterar"} seu e-mail.</p>
                        <div className="mt-10 w-full">
                            <Button className="h-14 w-full" onClick={onVerifyEmail}>
                                <MailCheckIcon className="size-4" strokeWidth={2.5} />
                                Validar e-mail
                            </Button>
                        </div>
                    </div>
                );
            case 'loading':
                return (
                    <div className={containerClass}>
                        <AppLoader />
                        <span className="font-sketch text-subtitle font-medium text-lg">{isEmailVerification ? "Validando e-mail..." : "Alterando e-mail..."}</span>
                    </div>
                );
            case 'success':
                return (
                    <div className={containerClass}>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sketch-success/20"
                        >
                            <Check size={24} strokeWidth={2.5} className="text-sketch-success" />
                        </motion.div>
                        <div className="flex flex-col">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="font-sketch text-subtitle font-semibold text-lg"
                            >
                                {isEmailVerification ? "E-mail verificado!" : "E-mail alterado!"}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="font-sketch text-paragraph text-sm"
                            >
                                Você será redirecionado para a página de login em alguns segundos.
                            </motion.p>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className={containerClass}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sketch-danger-lt"
                        >
                            <AlertCircle size={24} strokeWidth={2.5} className="text-sketch-danger" />
                        </motion.div>

                        <div className="flex flex-col">
                            <motion.h2
                                className="font-sketch text-subtitle font-semibold text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                Algo deu errado
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.3 }}
                                className="font-sketch text-paragraph text-sm"
                            >
                                O link de {isEmailVerification ? "verificação" : "alteração"} pode ser inválido ou ter expirado.
                            </motion.p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            {renderContent(mode, status)}
        </>
    )
}
