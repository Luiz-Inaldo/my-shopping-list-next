'use client'

import { APP_ROUTES } from '@/routes/app-routes'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { tryCatchRequest } from '@/functions/requests'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AppLoader } from '@/components/Loader/app-loader'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { securitySchema, SecurityFormData } from '@/zodSchema/security';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ComponentStatus } from '.'

export default function ResetPasswordPage() {

    const [validOobCode, setValidOobCode] = useState<boolean | null>(null);
    const params = useSearchParams();
    const router = useRouter();
    const code = params.get('oobCode');

    const [status, setStatus] = useState<ComponentStatus>('idle');

    const form = useForm<SecurityFormData>({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    })

    async function onSubmit(data: SecurityFormData) {
        let timeout: NodeJS.Timeout;
        if (!code) {
            setStatus('error');
            return;
        }

        setStatus('loading');
        const [_, error] = await tryCatchRequest(confirmPasswordReset(auth, code, data.newPassword))

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

    async function validateOobCode() {
        const [_, error] = await tryCatchRequest(verifyPasswordResetCode(auth, code || ''))
        if (error) {
            setValidOobCode(false);
            return;
        }
        setValidOobCode(true);
    }

    useEffect(() => {
        validateOobCode();
    }, [code]);

    const renderContent = (componentStatus: ComponentStatus) => {
        const containerClass = "relative overflow-hidden bg-app-container p-6 rounded-xl shadow-lg flex items-center gap-4 w-full max-w-sm mx-4"

        switch (componentStatus) {
            case 'idle':
                return (
                    <div className="bg-app-container p-6 rounded-xl shadow-lg flex flex-col w-full max-w-sm mx-4">
                        <h1 className="text-title text-left text-xl font-bold mb-4">
                            Alterar senha
                        </h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nova senha</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirmar senha</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-app-primary hover:bg-app-primary/90 text-snow rounded-full mt-4"
                                >
                                    Alterar senha
                                </Button>
                            </form>
                        </Form>
                    </div>
                );
            case 'loading':
                return (
                    <div className={containerClass}>
                        <AppLoader />
                        <span className="text-subtitle font-medium text-lg">Alterando senha...</span>
                    </div>
                );
            case 'success':
                return (
                    <div className={containerClass}>
                        <Image
                            src="/images/big-check.svg"
                            alt="Sucesso"
                            width={40}
                            height={40}
                        />
                        <div className="flex flex-col">
                            <h1 className="text-subtitle font-semibold text-lg">
                                Senha alterada!
                            </h1>
                            <p className="text-paragraph text-sm">
                                Sua senha foi alterada com sucesso. Você já pode acessar a plataforma.
                            </p>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className={containerClass}>
                        <Image
                            src="/images/error.svg"
                            alt="Erro"
                            width={40}
                            height={40}
                        />
                        <div className="flex flex-col">
                            <h2 className="text-subtitle font-semibold text-lg">
                                Algo deu errado
                            </h2>
                            <p className="text-paragraph text-sm">
                                O link de alteração de senha pode ser inválido ou ter expirado.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full min-h-screen-dvh flex flex-col items-center justify-center bg-app-background">
            {validOobCode === null && (
                <AppLoader size={80} />
            )}
            {validOobCode === false && (
                <div className="bg-app-container p-6 rounded-xl shadow-lg flex w-full max-w-sm mx-4 gap-4">
                    <Image
                        src="/images/error.svg"
                        alt="Erro"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col">
                        <h2 className="text-subtitle font-semibold text-lg">
                            Algo deu errado
                        </h2>
                        <p className="text-paragraph text-sm">
                            O link de alteração de senha pode ser inválido ou ter expirado.
                        </p>
                    </div>
                </div>
            )}
            {validOobCode === true && (
                renderContent(status)
            )}
        </div>
    )
}
