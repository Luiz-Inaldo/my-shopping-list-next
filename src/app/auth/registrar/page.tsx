'use client';
import Link from 'next/link';
import React, {
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
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

export default function Page() {
  const [loading, registerTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] =
    useState<boolean>(false);
  const searchParams = useSearchParams();

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
      <div className="w-full p-6 h-screen">
        <div className="flex flex-col items-center gap-4 mt-8">
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
        </div>

        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="flex items-center gap-3 rounded-lg px-3 py-3 border border-app-border">
                        <User size={18} className="text-paragraph" />
                        <input
                          minLength={4}
                          maxLength={20}
                          placeholder="Nome de usuário"
                          className="w-full bg-transparent outline-none placeholder:opacity-60 text-title"
                          {...field}
                        />
                      </div>
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
                      <div className="flex items-center gap-3 border rounded-lg px-3 py-3 border-border">
                        <Mail size={18} className="text-paragraph" />
                        <input
                          placeholder="E-mail"
                          className="w-full bg-transparent outline-none placeholder:opacity-60 text-subtitle"
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
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="flex items-center gap-3 border rounded-lg px-3 py-3 relative border-border">
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
                      </div>
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
                      <div className="flex items-center gap-3 border rounded-lg px-3 py-3 relative border-border">
                        <Lock size={18} className="text-paragraph" />
                        <input
                          type={isConfirmPasswordVisible ? 'text' : 'password'}
                          placeholder="Confirme a senha"
                          className="w-full bg-transparent outline-none placeholder:opacity-60 text-subtitle"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setIsConfirmPasswordVisible((v) => !v)}
                          className="text-paragraph"
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOff size={16} className="text-paragraph" />
                          ) : (
                            <Eye size={16} className="text-paragraph" />
                          )}
                        </button>
                      </div>
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

              <div>
                <Button
                  disabled={(username && !isUsernameAvailable) || loading}
                  type="submit"
                  className="w-full font-semibold mt-5 h-14 py-3 text-white text-base"
                >
                  {loading ? (
                    <>
                      <span>Criando conta</span>
                      <AppLoader size={18} strokeColor='white' />
                    </>
                  ) : (
                    <span>Criar Conta</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <p className="text-center text-sm mt-6 text-[color:var(--paragraph)]">
          Já tem uma conta?{' '}
          <Link href={APP_ROUTES.public.login.name} className="text-app-primary">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
