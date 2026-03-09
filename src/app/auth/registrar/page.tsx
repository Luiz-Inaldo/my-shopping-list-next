'use client';
import Link from 'next/link';
import React, {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LoaderCircle, User, Mail, Lock } from 'lucide-react';
import { registerFormSchema } from '@/zodSchema/registerForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { IRegisterUser } from '@/interfaces/user';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { useQuery } from '@tanstack/react-query';
import { createUsernameQueryOptions } from '@/hooks/queries/usernames';
import { debounce } from '@/functions/debounce';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AppLoader } from '@/components/Loader/app-loader';
import { APP_ROUTES } from '@/routes/app-routes';

const divVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delayMs: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: delayMs },
  }),
} as const;

const pageVariants = {
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: '50%' },
} as const;

export default function Page() {
  const [loading, registerTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] =
    useState<boolean>(false);
  const [isPageVisible, setIsPageVisible] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<IRegisterUser>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const { data: usernamesList } = useQuery(createUsernameQueryOptions());

  const username = form.watch('username');
  const verifyUsernameAvailability = useMemo(
    () =>
      debounce(() => {
        if (username && usernamesList?.list) {
          setIsUsernameAvailable(!usernamesList.list.includes(username));
        }
      }, 1_000),
    [username, usernamesList]
  );

  function handleChangePage() {
    setIsPageVisible(false);
    setTimeout(() => {
      router.push(APP_ROUTES.public.login.name);
    }, 500);
  }

  async function onSubmit(userCredentials: IRegisterUser) {
    const { email, password, username: profileUsername } = userCredentials;

    registerTransition(async () => {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = user.user.uid;

        if (!user.user.emailVerified) {
          await sendEmailVerification(user.user);
        }

        sendToastMessage({
          title: 'Usuário criado com sucesso!',
          type: 'success',
        });

        try {
          await setDoc(doc(db, 'users', uid), {
            uid,
            email,
            name: profileUsername,
            role: searchParams.get('adminregister') ? 'admin' : 'user',
            premium: {
              status: false,
              expires_at: null,
            },
            profile_img: '',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          await setDoc(doc(db, 'usernames', profileUsername), {
            uuid: uid,
          });
        } catch (error) {
          if (error instanceof FirebaseError) {
            sendToastMessage({
              title: 'Houve um erro ao criar o perfil.',
              type: 'error',
            });
          }
        }
      } catch (error) {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              sendToastMessage({
                title: 'Email ja cadastrado.',
                type: 'error',
              });
              break;

            case 'auth/invalid-email':
              sendToastMessage({
                title: 'Email inválido.',
                type: 'error',
              });
              break;

            default:
              sendToastMessage({
                title: 'Houve um erro ao criar o usuário.',
                type: 'error',
              });
              break;
          }
        }
      }
    });
  }

  useEffect(() => {
    if (username && usernamesList?.list) {
      verifyUsernameAvailability();
    }
  }, [username, usernamesList, verifyUsernameAvailability]);

  return (
    <main className="min-h-screen auth-page-light flex items-center justify-center p-4 bg-white">
      <AnimatePresence mode="wait">
        {isPageVisible && (
          <motion.div
            key="register"
            variants={pageVariants}
            initial={false}
            animate="visible"
            exit="exit"
            className="w-full max-w-[400px] p-6 sm:p-10"
          >
            <motion.div
              custom={0}
              variants={divVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-6 mb-8"
            >
              <Image
                src="/images/signup.svg"
                alt="Sign up illustration"
                width={220}
                height={160}
                priority
              />
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-title">Registre-se</h1>
                <p className="text-sm px-4 text-paragraph">
                  Preencha o formulário para continuar e organizar suas compras.
                </p>
              </div>
            </motion.div>

            <div className="mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <motion.div
                            variants={divVariants}
                            custom={0.1}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-3 bg-[#f8f9fa] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)] rounded-2xl px-4 py-4"
                          >
                            <User className="text-paragraph w-5 h-5" />
                            <input
                              minLength={4}
                              maxLength={20}
                              placeholder="Nome de usuário"
                              className="w-full bg-transparent outline-none placeholder:text-paragraph/50 text-title font-medium"
                              {...field}
                            />
                          </motion.div>
                        </FormControl>
                        {field.value && (
                          <div className="absolute -top-1 right-2">
                            {isUsernameAvailable ? (
                              <span className="text-[10px] sm:text-xs font-semibold" style={{ color: 'hsl(var(--app-primary))' }}>
                                Disponível
                              </span>
                            ) : (
                              <span className="text-[10px] sm:text-xs font-semibold text-destructive">
                                Indisponível
                              </span>
                            )}
                          </div>
                        )}
                        <FormMessage className="text-xs ml-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <motion.div
                            variants={divVariants}
                            custom={0.2}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-3 bg-[#f8f9fa] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)] rounded-2xl px-4 py-4"
                          >
                            <Mail className="text-paragraph w-5 h-5" />
                            <input
                              placeholder="E-mail"
                              className="w-full bg-transparent outline-none placeholder:text-paragraph/50 text-title font-medium"
                              {...field}
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage className="text-xs ml-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <motion.div
                            variants={divVariants}
                            custom={0.3}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-3 bg-[#f8f9fa] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)] rounded-2xl px-4 py-4"
                          >
                            <Lock className="text-paragraph w-5 h-5" />
                            <input
                              type={isPasswordVisible ? 'text' : 'password'}
                              placeholder="Senha"
                              className="w-full bg-transparent outline-none placeholder:text-paragraph/50 text-title font-medium"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setIsPasswordVisible((v) => !v)}
                              className="text-paragraph transition-colors hover:text-title"
                            >
                              {isPasswordVisible ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </motion.div>
                        </FormControl>
                        <FormMessage className="text-xs ml-2" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <motion.div
                            variants={divVariants}
                            custom={0.4}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-3 bg-[#f8f9fa] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)] rounded-2xl px-4 py-4"
                          >
                            <Lock className="text-paragraph w-5 h-5" />
                            <input
                              type={isConfirmPasswordVisible ? 'text' : 'password'}
                              placeholder="Confirme a senha"
                              className="w-full bg-transparent outline-none placeholder:text-paragraph/50 text-title font-medium"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setIsConfirmPasswordVisible((v) => !v)
                              }
                              className="text-paragraph transition-colors hover:text-title"
                            >
                              {isConfirmPasswordVisible ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </motion.div>
                        </FormControl>
                        <FormMessage className="text-xs ml-2" />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    variants={divVariants}
                    custom={0.5}
                    initial="hidden"
                    animate="visible"
                    className="pt-2"
                  >
                    <Button
                      disabled={(username && !isUsernameAvailable) || loading}
                      type="submit"
                      className="w-full font-bold h-14 rounded-2xl bg-[hsl(var(--app-primary))] text-white shadow-[6px_6px_12px_rgba(0,0,0,0.2),inset_4px_4px_6px_rgba(255,255,255,0.25),inset_-4px_-4px_6px_rgba(0,0,0,0.3)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="text-sm">Criando conta</span>
                          <AppLoader size={16} />
                        </>
                      ) : (
                        <span className="text-base">Criar Conta</span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </div>

            <motion.p
              variants={divVariants}
              custom={0.6}
              initial="hidden"
              animate="visible"
              className="text-center text-sm mt-8 text-paragraph font-medium"
            >
              Já tem uma conta?{' '}
              <span
                onClick={handleChangePage}
                className="font-bold cursor-pointer transition-colors hover:opacity-80"
                style={{ color: 'hsl(var(--app-secondary))' }}
              >
                Entrar
              </span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
