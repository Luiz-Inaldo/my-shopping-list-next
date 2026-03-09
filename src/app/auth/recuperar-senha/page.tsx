'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, LoaderCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

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
import { FirebaseError } from 'firebase/app';

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
  const [isSubmitting, submitTransition] = useTransition();
  const [isPageVisible, setIsPageVisible] = useState<boolean>(true);
  const router = useRouter();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function handleChangePage() {
    setIsPageVisible(false);
    setTimeout(() => {
      router.push(APP_ROUTES.public.login.name);
    }, 500);
  }

  async function onSubmit(values: ForgotPasswordInput) {
    submitTransition(async () => {
      const [_, error] = await tryCatchRequest<void, FirebaseError>(
        sendPasswordResetEmail(auth, values.email)
      );

      if (error) {
        sendToastMessage({
          title: error.code || 'Erro ao enviar email',
          type: 'error',
        });
        return;
      }

      sendToastMessage({
        title: 'Email de recuperação enviado com sucesso',
        type: 'success',
      });
    });
  }

  return (
    <main className="min-h-screen auth-page-light flex items-center justify-center p-4 bg-white">
      <AnimatePresence mode="wait">
        {isPageVisible && (
          <motion.div
            key="forgot-password"
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
                src="/images/forgot-password.svg"
                alt="Forgot Password illustration"
                width={220}
                height={220}
                priority
              />
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-title">
                  Esqueceu a Senha?
                </h1>
                <p className="text-sm px-4 text-paragraph">
                  Não se preocupe, acontece. Insira o e-mail associado à sua conta e enviaremos um link de recuperação.
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <motion.div
                            variants={divVariants}
                            custom={0.1}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-3 bg-[#f8f9fa] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06)] rounded-2xl px-4 py-4"
                          >
                            <Mail className="text-paragraph w-5 h-5" />
                            <input
                              placeholder="Endereço de e-mail"
                              className="w-full bg-transparent outline-none placeholder:text-paragraph/50 text-title font-medium"
                              {...field}
                            />
                          </motion.div>
                        </FormControl>
                        <FormMessage className="text-xs ml-2" />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    variants={divVariants}
                    custom={0.2}
                    initial="hidden"
                    animate="visible"
                    className="pt-2"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-bold h-14 rounded-2xl bg-[hsl(var(--app-primary))] text-white shadow-[6px_6px_12px_rgba(0,0,0,0.2),inset_4px_4px_6px_rgba(255,255,255,0.25),inset_-4px_-4px_6px_rgba(0,0,0,0.3)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <AppLoader size={16} />
                          <span className="text-sm">Enviando...</span>
                        </>
                      ) : (
                        <span className="text-base">Recuperar Senha</span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </div>

            <motion.p
              variants={divVariants}
              custom={0.3}
              initial="hidden"
              animate="visible"
              className="text-center text-sm mt-8 text-paragraph font-medium"
            >
              Lembrou da senha?{' '}
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
