'use client';
import { AppLoader } from '@/components/Loader/app-loader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCustomToast } from '@/context/CustomToastContext';
import { tryCatchRequest } from '@/functions/requests';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { ILoginUser } from '@/interfaces/user';
import { auth } from '@/lib/firebase';
import { APP_ROUTES } from '@/routes/app-routes';
import { loginFormSchema } from '@/zodSchema/loginForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, Lock, User, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
  exit: { opacity: 0, x: '-50%' },
} as const;

export default function Page() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPageVisible, setIsPageVisible] = useState<boolean>(true);
  const [loading, loadingTransition] = useTransition();
  const router = useRouter();

  const { customToast } = useCustomToast();

  const form = useForm<ILoginUser>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function handleGotoRegister() {
    setIsPageVisible(false);
    setTimeout(() => {
      router.push(APP_ROUTES.public.registro.name);
    }, 500);
  }

  function handleGotoForgotPassword() {
    setIsPageVisible(false);
    setTimeout(() => {
      router.push(APP_ROUTES.public.forgotPassword.name);
    }, 500);
  }

  async function onSubmit(userCredentials: ILoginUser) {
    customToast.loading('Validando suas credenciais...');
    loadingTransition(async () => {
      const { email, password } = userCredentials;

      const [_, error] = await tryCatchRequest<void, FirebaseError>(async () => {
        const firebaseLoginResponse = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const token = await firebaseLoginResponse.user.getIdToken();

        //TODO: adicionar tratamento de encode com JWT
        await fetch('/api/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      })

      if (error) {
        console.error(error.code);
        switch (error.code) {
          case 'auth/invalid-credential':
            customToast.error('Credenciais incorretas. Tente novamente.');
            break;

          default:
            customToast.error('Erro ao fazer login. Tente novamente.');
            break;
        }
      }

      customToast.success('Login realizado com sucesso.', { autohide: 1500 });
      setTimeout(() => {
        toast.dismiss();
        router.push(APP_ROUTES.private.home.name);
      }, 2000);

    });
  }

  return (
    <main className="bg-white min-h-screen auth-page-light flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {isPageVisible && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial={false}
            animate="visible"
            exit="exit"
            className="w-full p-5"
          >
            <motion.div
              custom={0}
              variants={divVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-6 mb-8"
            >
              <Image
                src="/images/login.svg"
                alt="Login illustration"
                width={220}
                height={160}
                priority
              />
              <h1
                className="text-3xl text-center font-bold"
                style={{ color: 'var(--title)' }}
              >
                Bem-vindo de volta!
              </h1>
              <p
                className="text-sm px-4 text-center"
                style={{ color: 'var(--paragraph)' }}
              >
                Acesse sua conta para organizar suas compras com um toque de mágica.
              </p>
            </motion.div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
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
                            <User className="text-paragraph w-5 h-5" />
                            <input
                              aria-label="E-mail"
                              placeholder="E-mail"
                              className="w-full bg-transparent outline-none placeholder:text-paragraph/50 text-title font-medium"
                              type="email"
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
                          <div className="space-y-2">
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

                            <motion.p
                              variants={divVariants}
                              custom={0.4}
                              initial="hidden"
                              animate="visible"
                              className="text-right text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
                              style={{ color: 'hsl(var(--app-secondary))' }}
                              onClick={handleGotoForgotPassword}
                            >
                              esqueceu sua senha?
                            </motion.p>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs ml-2" />
                      </FormItem>
                    )}
                  />
                </div>

                <motion.div
                  variants={divVariants}
                  custom={0.5}
                  initial="hidden"
                  animate="visible"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-bold h-14 rounded-2xl bg-[hsl(var(--app-primary))] text-white shadow-[6px_6px_12px_rgba(0,0,0,0.2),inset_4px_4px_6px_rgba(255,255,255,0.25),inset_-4px_-4px_6px_rgba(0,0,0,0.3)] hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    {loading ? <AppLoader size={16} /> : 'Entrar'}
                  </Button>
                </motion.div>
              </form>
            </Form>

            <motion.div
              variants={divVariants}
              custom={0.6}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-4 mt-6"
            >
              <hr className="flex-1 border-t border-app-border" />
              <span className="text-sm text-paragraph">Ou entre com</span>
              <hr className="flex-1 border-t border-app-border" />
            </motion.div>

            <motion.div
              variants={divVariants}
              custom={0.7}
              initial="hidden"
              animate="visible"
              className="flex gap-3 mt-4"
            >
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
            </motion.div>

            <motion.p
              variants={divVariants}
              custom={0.8}
              initial="hidden"
              animate="visible"
              className="text-center text-sm mt-6 text-paragraph"
            >
              Ainda não tem uma conta?{' '}
              <span
                onClick={handleGotoRegister}
                className="font-bold cursor-pointer transition-colors hover:opacity-80"
                style={{ color: 'hsl(var(--app-secondary))' }}
              >
                Cadastre-se
              </span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
