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
    <main className="page-wrapper auth-page-light flex items-center justify-center bg-app-container">
      <AnimatePresence mode="wait">
        {isPageVisible && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial={false}
            animate="visible"
            exit="exit"
            className="w-full p-6 h-screen"
          >
            <motion.div
              custom={0}
              variants={divVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-4 mt-8"
            >
              <Image
                src="/images/signup.svg"
                alt="Sign up illustration"
                width={220}
                height={160}
              />
              <h1 className="text-2xl font-semibold text-title">Registre-se</h1>
              <p className="text-sm text-center max-w-[340px] text-paragraph">
                Preencha o formulário para continuar
              </p>
            </motion.div>

            <div className="mt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
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
                            className="flex items-center gap-3 rounded-lg px-3 py-3 border border-app-border"
                          >
                            <User size={18} className="text-paragraph" />
                            <input
                              minLength={4}
                              maxLength={20}
                              placeholder="Nome de usuário"
                              className="w-full bg-transparent outline-none placeholder:opacity-60 text-title"
                              {...field}
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                        {field.value && (
                          <>
                            {isUsernameAvailable ? (
                              <span className="absolute top-2.5 right-2 text-xs text-app-primary">
                                Nome de usuário disponível
                              </span>
                            ) : (
                              <span className="absolute top-2.5 right-2 text-xs text-destructive">
                                Nome de usuário já utilizado
                              </span>
                            )}
                          </>
                        )}
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
                            className="flex items-center gap-3 border rounded-lg px-3 py-3 border-border"
                          >
                            <Mail size={18} className="text-paragraph" />
                            <input
                              placeholder="E-mail"
                              className="w-full bg-transparent outline-none placeholder:opacity-60 text-subtitle"
                              {...field}
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <motion.div
                            variants={divVariants}
                            custom={0.3}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-3 border rounded-lg px-3 py-3 relative border-border"
                          >
                            <Lock size={18} className="text-paragraph" />
                            <input
                              type={isPasswordVisible ? 'text' : 'password'}
                              placeholder="Senha"
                              className="w-full bg-transparent outline-none placeholder:opacity-60 text-subtitle"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setIsPasswordVisible((v) => !v)}
                              className="text-paragraph"
                            >
                              {isPasswordVisible ? (
                                <EyeOff size={16} className="text-paragraph" />
                              ) : (
                                <Eye size={16} className="text-paragraph" />
                              )}
                            </button>
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormControl>
                          <motion.div
                            variants={divVariants}
                            custom={0.4}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-3 border rounded-lg px-3 py-3 relative border-border"
                          >
                            <Lock size={18} className="text-paragraph" />
                            <input
                              type={isConfirmPasswordVisible ? 'text' : 'password'}
                              placeholder="Confirme a senha"
                              className="w-full bg-transparent outline-none placeholder:opacity-60 text-subtitle"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setIsConfirmPasswordVisible((v) => !v)
                              }
                              className="text-paragraph"
                            >
                              {isConfirmPasswordVisible ? (
                                <EyeOff size={16} className="text-paragraph" />
                              ) : (
                                <Eye size={16} className="text-paragraph" />
                              )}
                            </button>
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <p className="text-xs text-center text-[color:var(--paragraph)]">
                By signing up, you are agree to our{' '}
                <Link
                  href="#"
                  className="text-app-primary text-[hsl(var(--app-primary))]"
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  href="#"
                  className="text-app-primary text-[hsl(var(--app-primary))]"
                >
                  Privacy Policy
                </Link>
              </p> */}

                  <motion.div
                    variants={divVariants}
                    custom={0.5}
                    initial="hidden"
                    animate="visible"
                  >
                    <Button
                      disabled={(username && !isUsernameAvailable) || loading}
                      type="submit"
                      className="w-full font-semibold mt-5 h-14 py-3 text-white text-base"
                    >
                      {loading ? (
                        <>
                          <span>Criando conta</span>
                          <AppLoader size={18} />
                        </>
                      ) : (
                        <span>Criar Conta</span>
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
              className="text-center text-sm mt-6 text-[color:var(--paragraph)]"
            >
              Já tem uma conta?{' '}
              <span
                onClick={handleChangePage}
                className="text-app-primary cursor-pointer hover:underline"
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
