'use client'

import { APP_ROUTES } from '@/routes/app-routes'
import { Button } from '@/components/ui/button'
import { House, MailCheckIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
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

    const renderContent = (mode: string | null, componentStatus: ComponentStatus) => {
        const isEmailVerification = mode === 'verifyEmail';
        const containerClass = "relative overflow-hidden bg-app-container p-6 rounded-xl shadow-lg flex items-center gap-4 w-full max-w-sm mx-4"

        switch (componentStatus) {
            case 'idle':
                return (
                    <div className="bg-app-container p-6 rounded-xl shadow-lg flex flex-col w-full max-w-sm mx-4">
                        <h1 className="text-title text-left text-xl font-bold">
                            {isEmailVerification ? "Confirmação" : "Alteração"} de e-mail
                        </h1>
                        <p className="text-paragraph text-sm">Clique no botão abaixo para {isEmailVerification ? "validar" : "alterar"} seu e-mail.</p>
                        <div className="w-full mt-10">
                            <Button
                                className="w-full bg-app-primary hover:bg-app-primary/90 text-snow rounded-full" onClick={onVerifyEmail}>
                                <MailCheckIcon className="w-4 h-4" />
                                Validar e-mail
                            </Button>
                        </div>
                    </div>
                );
            case 'loading':
                return (
                    <div className={containerClass}>
                        <AppLoader />
                        <span className="text-subtitle font-medium text-lg">{isEmailVerification ? "Validando e-mail..." : "Alterando e-mail..."}</span>
                    </div>
                );
            case 'success':
                return (
                    <div className={containerClass}>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="shrink-0"
                        >
                            <Image
                                src="/images/big-check.svg"
                                alt="Sucesso"
                                width={40}
                                height={40}
                            />
                        </motion.div>
                        <div className="flex flex-col">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-subtitle font-semibold text-lg"
                            >
                                {isEmailVerification ? "E-mail verificado!" : "E-mail alterado!"}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <p className="text-paragraph text-sm">
                                    Você será redirecionado para a página de login em alguns segundos.
                                </p>
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
                            className="shrink-0"
                        >
                            <Image
                                src="/images/error.svg"
                                alt="Erro"
                                width={40}
                                height={40}
                            />
                        </motion.div>

                        <div className="flex flex-col">
                            <motion.h2
                                className="text-subtitle font-semibold text-lg"
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
                            >
                                <p className="text-paragraph text-sm">
                                    O link de {isEmailVerification ? "verificação" : "alteração"} pode ser inválido ou ter expirado.
                                </p>
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
