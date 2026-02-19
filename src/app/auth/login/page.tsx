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
    <main className="bg-app-container page-wrapper auth-page-light flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isPageVisible && (
          <motion.div
            key="login"
            variants={pageVariants}
            initial={false}
            animate="visible"
            exit="exit"
            className="w-full p-6"
          >
            <motion.div
              custom={0}
              variants={divVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-4 mt-8"
            >
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
            </motion.div>
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
                            <motion.div
                              variants={divVariants}
                              custom={0.1}
                              initial="hidden"
                              animate="visible"
                              className="flex items-center gap-3 border border-app-border rounded-lg px-3 py-3"
                            >
                              <User className="text-paragraph" />
                              <input
                                aria-label="E-mail"
                                placeholder="E-mail"
                                className="w-full bg-transparent outline-none placeholder:opacity-60 text-subtitle"
                                type="email"
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
                                  <EyeOff
                                    size={16}
                                    className="text-paragraph"
                                  />
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

                    <motion.p
                      variants={divVariants}
                      custom={0.4}
                      initial="hidden"
                      animate="visible"
                      className="text-right text-sm text-app-primary"
                      onClick={handleGotoForgotPassword}
                    >
                      Esqueci a senha
                    </motion.p>

                    <motion.div
                      variants={divVariants}
                      custom={0.5}
                      initial="hidden"
                      animate="visible"
                    >
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full font-semibold h-14 py-3 text-white text-base mt-2"
                      >
                        {loading ? <AppLoader size={16} /> : 'Entrar'}
                      </Button>
                    </motion.div>
                  </div>
                </div>
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
                className="text-app-primary hover:underline"
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
