'use client'

import { APP_ROUTES } from '@/routes/app-routes'
import { Button } from '@/components/ui/button'
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
    FormMessage,
} from '@/components/ui/form'
import { AlertCircle, Check, Lock } from 'lucide-react'
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

    const containerClass = "rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-6 shadow-sketch flex items-center gap-4 w-full max-w-[400px]"

    const renderContent = (componentStatus: ComponentStatus) => {
        switch (componentStatus) {
            case 'idle':
                return (
                    <div className="rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-6 shadow-sketch flex flex-col w-full max-w-[400px]">
                        <h1 className="font-sketchHeading text-title text-left text-xl font-bold mb-4">
                            Alterar senha
                        </h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex items-center gap-3 rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-3 shadow-sketch-sm">
                                                    <Lock size={18} strokeWidth={2.5} className="text-sketch-fg" />
                                                    <input
                                                        type="password"
                                                        placeholder="Nova senha"
                                                        className="font-sketch w-full bg-transparent outline-none placeholder:text-paragraph/60 text-subtitle"
                                                        {...field}
                                                    />
                                                </div>
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
                                            <FormControl>
                                                <div className="flex items-center gap-3 rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-3 shadow-sketch-sm">
                                                    <Lock size={18} strokeWidth={2.5} className="text-sketch-fg" />
                                                    <input
                                                        type="password"
                                                        placeholder="Confirmar senha"
                                                        className="font-sketch w-full bg-transparent outline-none placeholder:text-paragraph/60 text-subtitle"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="mt-4 h-14 w-full">
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
                        <span className="font-sketch text-subtitle font-medium text-lg">Alterando senha...</span>
                    </div>
                );
            case 'success':
                return (
                    <div className={containerClass}>
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sketch-success/20">
                            <Check size={24} strokeWidth={2.5} className="text-sketch-success" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-sketch text-subtitle font-semibold text-lg">
                                Senha alterada!
                            </h1>
                            <p className="font-sketch text-paragraph text-sm">
                                Sua senha foi alterada com sucesso. Você já pode acessar a plataforma.
                            </p>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className={containerClass}>
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sketch-danger-lt">
                            <AlertCircle size={24} strokeWidth={2.5} className="text-sketch-danger" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="font-sketch text-subtitle font-semibold text-lg">
                                Algo deu errado
                            </h2>
                            <p className="font-sketch text-paragraph text-sm">
                                O link de alteração de senha pode ser inválido ou ter expirado.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex w-full flex-col items-center justify-center">
            {validOobCode === null && (
                <AppLoader size={80} />
            )}
            {validOobCode === false && (
                <div className="rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-6 shadow-sketch flex w-full max-w-[400px] gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sketch-danger-lt">
                        <AlertCircle size={24} strokeWidth={2.5} className="text-sketch-danger" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-sketch text-subtitle font-semibold text-lg">
                            Algo deu errado
                        </h2>
                        <p className="font-sketch text-paragraph text-sm">
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
