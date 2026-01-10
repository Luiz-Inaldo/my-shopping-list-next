'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePageOverlay } from '@/context/PageOverlayContext';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { ILoginUser } from '@/interfaces/user';
import { auth } from '@/lib/firebase';
import { APP_ROUTES } from '@/routes/app-routes';
import { loginFormSchema } from '@/zodSchema/loginForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, Lock, User, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Page() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, loadingTransition] = useTransition();

  const { handleChangeRoute } = usePageOverlay();

  const form = useForm<ILoginUser>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(userCredentials: ILoginUser) {
    loadingTransition(async () => {
      const { email, password } = userCredentials;

      try {
        const firebaseLoginResponse = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const token = await firebaseLoginResponse.user.getIdToken();

        //TODO: adicionar tratamento de encode com JWT
        const response = await fetch('/api/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          sendToastMessage({
            title: 'Erro ao fazer login. Tente novamente.',
            type: 'error',
          });
          return;
        }

        sendToastMessage({
          title: 'Login realizado com sucesso.',
          type: 'success',
        });
        setTimeout(() => {
          toast.dismiss();
          handleChangeRoute(APP_ROUTES.private.home.name);
        }, 2000);
      } catch (error) {
        if (error instanceof FirebaseError) {
          console.error(error.code);
          switch (error.code) {
            case 'auth/invalid-credential':
              sendToastMessage({
                title: 'Credenciais incorretas. Tente novamente.',
                type: 'error',
              });
              break;

            default:
              sendToastMessage({
                title: 'Erro ao fazer login. Tente novamente.',
                type: 'error',
              });
              break;
          }
        }
      }
    });
  }
  return (
    <main className="bg-app-container page-wrapper auth-page-light flex items-center justify-center">
      <div className="w-full p-6">
        <div className="flex flex-col items-center gap-4 mt-8">
          <Image
            src="/images/login.svg"
            alt="Login illustration"
            width={220}
            height={160}
          />
          <h1
            className="text-3xl font-semibold"
            style={{ color: 'var(--title)' }}
          >
            Login
          </h1>
          <p
            className="text-sm text-center max-w-[320px]"
            style={{ color: 'var(--paragraph)' }}
          >
            Insira um e-mail e senha válidos para acessar sua conta.
          </p>
        </div>
        <Form {...form}>
          <form className="mt-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-6 bg-transparent rounded-xl p-0">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-3 border border-app-border rounded-lg px-3 py-3">
                          <User className="text-paragraph" />
                          <input
                            aria-label="E-mail"
                            placeholder="E-mail"
                            className="w-full bg-transparent outline-none placeholder:opacity-60 text-subtitle"
                            type="email"
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

                <div className="text-right">
                  <Link
                    href={APP_ROUTES.public.forgotPassword.name}
                    className="text-sm text-app-primary"
                  >
                    Esqueci a senha
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold h-14 py-3 text-white text-base mt-2"
                >
                  Entrar
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <div className="flex items-center gap-4 mt-6">
          <hr className="flex-1 border-t border-app-border" />
          <span className="text-sm text-paragraph">Ou entre com</span>
          <hr className="flex-1 border-t border-app-border" />
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            disabled
            variant="ghost"
            className="flex-1 h-14 hover:bg-transparent rounded-xl py-2 shadow flex items-center justify-center gap-2 border-app-border"
          >
            <Image
              src="/images/google-logo.svg"
              alt="Google logo"
              width={20}
              height={20}
            />
            <span className="text-title">Google</span>
          </Button>
        </div>

        <p
          className="text-center text-sm mt-6 text-paragraph"
        >
          Ainda não tem uma conta?{' '}
          <Link
            href={APP_ROUTES.public.registro.name}
            className="text-app-primary hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
