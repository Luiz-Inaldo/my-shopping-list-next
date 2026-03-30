'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import { doc, getDoc, setDoc, deleteDoc, DocumentSnapshot } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

import { auth, db } from '@/lib/firebase';
import { userInfoFormSchema, IUserInfoForm } from '@/zodSchema/userInfo';
import { createUsernameQueryOptions } from '@/hooks/queries/usernames';
import { debounce } from '@/functions/debounce';
import { AppLoader } from '@/components/Loader/app-loader';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { tryCatchRequest } from '@/functions/requests';
import { APP_ROUTES } from '@/routes/app-routes';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import useGeneralUserStore from '@/store/generalUserStore';

const divVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delayMs: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, delay: delayMs },
    })
} as const;

export default function UserInfoPage() {
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const [userIdFromToken, setUserIdFromToken] = useState<string | null>(null);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(false);

    const form = useForm<IUserInfoForm>({
        resolver: zodResolver(userInfoFormSchema),
        defaultValues: {
            username: '',
        },
    });

    const { data: usernamesList } = useQuery(createUsernameQueryOptions());
    const usernameValue = form.watch('username');

    // Debounce para verificar disponibilidade do username
    const verifyUsernameAvailability = useMemo(
        () =>
            debounce(() => {
                if (usernameValue && usernamesList?.list) {
                    setIsUsernameAvailable(!usernamesList.list.includes(usernameValue.toLowerCase()));
                }
            }, 1000),
        [usernameValue, usernamesList]
    );

    useEffect(() => {
        if (usernameValue && usernamesList?.list) {
            verifyUsernameAvailability();
        }
    }, [usernameValue, usernamesList, verifyUsernameAvailability]);

    // Validação do token temporário
    useEffect(() => {
        async function validateToken() {
            if (!token) {
                setIsValidToken(false);
                return;
            }

            const [tokenDoc, error] = await tryCatchRequest<DocumentSnapshot, FirebaseError>(
                getDoc(doc(db, 'profile_temp_tokens', token))
            );

            if (error || !tokenDoc?.exists()) {
                if (error) console.error('Erro ao validar token:', error);
                setIsValidToken(false);
                return;
            }

            setIsValidToken(true);
            setUserIdFromToken(tokenDoc.data().user_id);
        }

        validateToken();
    }, [token]);

    async function onSubmit(data: IUserInfoForm) {
        const uid = auth.currentUser?.uid || userIdFromToken;
        const email = auth.currentUser?.email;

        if (!uid) {
            sendToastMessage({
                title: 'Erro de autenticação. Tente logar novamente.',
                type: 'error',
            });
            return;
        }

        const [_, error] = await tryCatchRequest<void, FirebaseError>(async () => {
            // 1. Criar documento do usuário
            await setDoc(doc(db, 'users', uid), {
                uid,
                email: email || '',
                name: data.username,
                role: 'user',
                premium: {
                    status: false,
                    expires_at: null,
                },
                profile_img: '',
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // 2. Criar referência de username único
            await setDoc(doc(db, 'usernames', data.username), {
                uuid: uid,
            });

            // 3. Deletar token temporário
            await deleteDoc(doc(db, 'profile_temp_tokens', token));

            // 4. Seta informações do usuário na store
            useGeneralUserStore.getState().setUserProfile({
                uid,
                email: email || '',
                name: data.username,
                role: 'user',
                premium: {
                    status: false,
                    expires_at: null,
                },
                profile_img: '',
                emailVerified: auth.currentUser?.emailVerified ?? false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });

        if (error) {
            console.error('Erro na submissão:', error);
            sendToastMessage({
                title: 'Erro ao salvar informações. Tente novamente.',
                type: 'error',
            });
            return;
        }

        sendToastMessage({
            title: 'Cadastro finalizado com sucesso!',
            type: 'success',
        });

        setTimeout(() => {
            router.push(APP_ROUTES.private.home.name)
        }, 2000);
    }

    if (isValidToken === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-sketch-white">
                <AppLoader size={50} />
            </div>
        );
    }

    if (isValidToken === false) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-sketch-white p-4">
                <div className="text-center">
                    <p className="font-sketchHeading text-2xl text-sketch-fg">Token inválido. Tente novamente</p>
                    <Button
                        className="mt-4"
                        onClick={() => router.push(APP_ROUTES.public.login.name)}
                    >
                        <ArrowLeft size={16} />
                        Voltar para Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <main
            className="auth-page-light flex min-h-screen items-center justify-center p-4 text-sketch-fg"
            style={{
                backgroundImage: "url('/images/food_background.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <motion.div
                variants={divVariants}
                initial="hidden"
                animate="visible"
                transition={{
                    duration: 0.3,
                }}
                className="w-full max-w-[400px]"
            >
                <div className="rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-8 shadow-sketch">
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="font-sketchHeading text-3xl font-semibold">Finalize o seu cadastro</h1>
                        <p className="font-sketch text-center text-sm text-sketch-fg/60">
                            Estamos quase lá! Escolha seu nome de usuário.
                        </p>
                    </div>

                    <div className="mt-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <label className="font-sketch mb-2 block text-sm font-medium">
                                                preencha o campo com o nome de usuário
                                            </label>
                                            <FormControl>
                                                <div className="flex items-center gap-3 rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-3 shadow-sketch-sm">
                                                    <User size={18} strokeWidth={2.5} className="text-sketch-fg" />
                                                    <input
                                                        placeholder="Nome de usuário"
                                                        className="font-sketch w-full bg-transparent outline-none placeholder:text-sketch-fg/40"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            {field.value && field.value.length >= 4 && (
                                                <div className="absolute top-[-10px] right-0">
                                                    {isUsernameAvailable ? (
                                                        <span className="font-sketch text-[10px] text-sketch-success">
                                                            Disponível
                                                        </span>
                                                    ) : (
                                                        <span className="font-sketch text-[10px] text-sketch-danger">
                                                            Já utilizado
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting || (usernameValue.length >= 0 && !isUsernameAvailable)}
                                    className="h-14 w-full py-3 text-lg"
                                >
                                    {form.formState.isSubmitting ? (
                                        <div className="flex items-center gap-3">
                                            <span>Salvando...</span>
                                            <AppLoader size={20} />
                                        </div>
                                    ) : (
                                        'Finalizar'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
