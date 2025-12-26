'use client'

import { APP_ROUTES } from '@/routes/app-routes'
import { Button } from '@/components/ui/button'
import { Loader2, House } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type ComponentStatus = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {

    const params = useSearchParams();
    const mode = params.get('mode');
    const code = params.get('oobCode');

    const [status, setStatus] = useState<ComponentStatus>('loading');

    function onVerifyEmail() {
        // Lógica de verificação será implementada aqui
    }

    useEffect(() => {
        onVerifyEmail();
    }, []);

    const renderContent = (mode: string | null, code: string | null, componentStatus: ComponentStatus) => {
        switch (componentStatus) {
            case 'loading':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-app-container p-8 rounded-xl shadow-lg flex flex-col items-center justify-center gap-4 w-full max-w-sm mx-4"
                    >
                        <Loader2 className="h-10 w-10 text-default-green animate-spin" />
                        <span className="text-subtitle font-medium">Validando e-mail...</span>
                    </motion.div>
                );
            case 'success':
                return (
                    <div className="bg-app-container p-8 rounded-xl shadow-lg flex flex-col items-center justify-center w-full max-w-sm mx-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                            className="w-[150px] h-[150px] mx-auto mb-6"
                        >
                            <Image
                                src="/images/big-check.svg"
                                alt="Sucesso"
                                width={150}
                                height={150}
                                priority
                            />
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-subtitle text-center text-lg font-semibold mb-2"
                        >
                            E-mail verificado com sucesso!
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-paragraph text-center text-sm mb-6"
                        >
                            Sua conta foi ativada. Você já pode acessar a plataforma.
                        </motion.p>
                        <motion.div
                            className="w-full"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Link href={APP_ROUTES.public.auth.name} className="w-full">
                                <Button className="w-full bg-default-green hover:bg-default-green/90 text-snow rounded-full">
                                    <House size={18} className="mr-2" />
                                    Ir para Login
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                );
            case 'error':
                return (
                    <div className="bg-app-container p-8 rounded-xl shadow-lg flex flex-col items-center justify-center w-full max-w-sm mx-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                            className="mb-6"
                        >
                            <Image
                                src="/images/error.svg"
                                alt="Erro"
                                width={120}
                                height={120}
                                priority
                            />
                        </motion.div>

                        <motion.h2
                            className="font-semibold text-subtitle text-center text-lg mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                        >
                            Não foi possível verificar
                        </motion.h2>

                        <motion.p
                            className="text-sm text-paragraph text-center mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            O link de verificação pode ser inválido ou ter expirado.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="w-full"
                        >
                            <Link href={APP_ROUTES.public.auth.name} className="w-full">
                                <Button variant="outline" className="w-full rounded-full border-default-green text-default-green hover:bg-default-green/10 hover:text-default-green">
                                    <House size={18} className="mr-2" />
                                    Voltar para Login
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full min-h-screen-dvh flex flex-col items-center justify-center bg-app-background">
            {renderContent(mode, code, status)}
        </div>
    )
}
