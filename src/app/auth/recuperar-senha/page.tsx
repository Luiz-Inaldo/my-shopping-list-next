'use client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
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
    <main
      className="auth-page-light flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundImage: "url('/images/food_background.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {isPageVisible && (
          <motion.div
            key="forgot-password"
            variants={pageVariants}
            initial={false}
            animate="visible"
            exit="exit"
            className="w-full max-w-[400px]"
          >
            <div className="rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-6 shadow-sketch">
              <motion.div
                custom={0}
                variants={divVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center gap-4"
              >
                <h1 className="font-sketchHeading text-2xl font-semibold text-sketch-fg">
                  Esqueceu a Senha
                </h1>
                <p className="font-sketch text-center text-sm text-sketch-fg/60 max-w-[340px]">
                  Não se preocupe, acontece. Por favor insira o endereço de e-mail associado à
                  sua conta.
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <motion.div
                              variants={divVariants}
                              custom={0.1}
                              initial="hidden"
                              animate="visible"
                              className="flex items-center gap-3 rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-3 shadow-sketch-sm"
                            >
                              <Mail size={18} strokeWidth={2.5} className="text-sketch-fg" />
                              <input
                                placeholder="Endereço de email"
                                className="font-sketch w-full bg-transparent outline-none placeholder:text-sketch-fg/40 text-sketch-fg"
                                {...field}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <motion.div
                      variants={divVariants}
                      custom={0.2}
                      initial="hidden"
                      animate="visible"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="!mt-6 h-14 w-full py-3 text-base"
                      >
                        {isSubmitting ? (
                          <>
                            <AppLoader size={18} />
                            Enviando...
                          </>
                        ) : (
                          'Recuperar Senha'
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
                className="mt-6 text-center font-sketch text-sm text-sketch-fg/60"
              >
                Lembrou da senha?{' '}
                <span
                  onClick={handleChangePage}
                  className="cursor-pointer text-sketch-accent hover:underline"
                >
                  Entrar
                </span>
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
