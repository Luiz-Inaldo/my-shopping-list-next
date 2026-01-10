'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { tryCatchRequest } from '@/functions/requests';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/zodSchema/forgotPassword';
import { AppLoader } from '@/components/Loader/app-loader';
import { APP_ROUTES } from '@/routes/app-routes';

export default function Page() {
  const [isSubmitting, submitTransition] = useTransition();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    submitTransition(async () => {
      const [response, error] = await tryCatchRequest(() =>
        sendPasswordResetEmail(auth, values.email)
      );

      if (response) {
        sendToastMessage({
          title: 'Email de recuperação enviado com sucesso',
          type: 'success',
        });
      }

      if (error) {
        sendToastMessage({
          title: error.code || 'Erro ao enviar email',
          type: 'error',
        });
      }
    });
  }

  return (
    <main className="page-wrapper auth-page-light bg-app-container">
      <div className="w-full min-h-screen p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center gap-4 mt-8">
            <Image
              src="/images/forgot-password.svg"
              alt="Forgot Password illustration"
              width={220}
              height={220}
            />
            <h1 className="text-2xl font-semibold text-[color:var(--title)]">
              Esqueceu a Senha
            </h1>
            <p className="text-sm text-center max-w-[340px] text-[color:var(--paragraph)]">
              Não se preocupe, acontece. Por favor insira o endereço associado à
              sua conta.
            </p>
          </div>

          <div className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-3 border rounded-lg px-3 py-3 border-app-border">
                          <Mail size={18} className="text-paragraph" />
                          <input
                            placeholder="Endereço de email"
                            className="w-full bg-transparent outline-none placeholder:opacity-60 text-subtitle"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 h-14 font-semibold text-base text-white !mt-6"
                >
                  {isSubmitting ? (
                    <>
                      <AppLoader strokeColor="white" size={18} />
                      Enviando...
                    </>
                  ) : (
                    'Recuperar Senha'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <p className="text-center text-sm mt-6 text-[color:var(--paragraph)]">
          Lembrou da senha?{' '}
          <Link href={APP_ROUTES.public.login.name} className="text-app-primary">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
