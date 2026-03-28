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
import {
  LoginPageOverlayProvider,
  useLoginPageOverlay,
} from '@/context/LoginPageOverlayContext';
import { tryCatchRequest } from '@/functions/requests';
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
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

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

function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPageVisible, setIsPageVisible] = useState<boolean>(true);
  const [loading, loadingTransition] = useTransition();
  const router = useRouter();

  const { showLoading, showSuccess, showError } = useLoginPageOverlay();

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
    showLoading('Validando suas credenciais...');
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
            showError('Credenciais incorretas. Tente novamente.');
            break;

          default:
            showError('Erro ao fazer login. Tente novamente.');
            break;
        }
        return;
      }

      showSuccess('Login realizado com sucesso!');
      setTimeout(() => {
        router.push(APP_ROUTES.private.home.name);
      }, 2000);

    });
  }

  return (
    <AnimatePresence mode="wait">
      {isPageVisible && (
        <motion.div
          key="login"
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
              <h1 className="font-sketchHeading text-3xl font-semibold text-sketch-fg">
                Login
              </h1>
              <p className="font-sketch text-center text-sm text-sketch-fg/60 max-w-[320px]">
                Insira um e-mail e senha válidos para acessar sua conta.
              </p>
            </motion.div>
            <Form {...form}>
              <form className="mt-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                            className="flex items-center gap-3 rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-3 shadow-sketch-sm"
                          >
                            <User size={18} strokeWidth={2.5} className="text-sketch-fg" />
                            <input
                              aria-label="E-mail"
                              placeholder="E-mail"
                              className="font-sketch w-full bg-transparent outline-none placeholder:text-sketch-fg/40 text-sketch-fg"
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
                            className="flex items-center gap-3 rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-3 shadow-sketch-sm"
                          >
                            <Lock size={18} strokeWidth={2.5} className="text-sketch-fg" />
                            <input
                              type={isPasswordVisible ? 'text' : 'password'}
                              placeholder="Senha"
                              className="font-sketch w-full bg-transparent outline-none placeholder:text-sketch-fg/40 text-sketch-fg"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setIsPasswordVisible((v) => !v)}
                              className="text-sketch-fg"
                            >
                              {isPasswordVisible ? (
                                <EyeOff size={16} strokeWidth={2.5} />
                              ) : (
                                <Eye size={16} strokeWidth={2.5} />
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
                    className="font-sketch cursor-pointer text-right text-sm text-sketch-accent hover:text-sketch-accent-dk"
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
                      className="mt-2 h-14 w-full py-3 text-base"
                    >
                      {loading ? <AppLoader size={16} /> : 'Entrar'}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </Form>

            <motion.div
              variants={divVariants}
              custom={0.6}
              initial="hidden"
              animate="visible"
              className="mt-6 flex items-center gap-4"
            >
              <hr className="flex-1 border-t border-sketch-border" />
              <span className="font-sketch text-sm text-sketch-fg/60">Ou entre com</span>
              <hr className="flex-1 border-t border-sketch-border" />
            </motion.div>

            <motion.div
              variants={divVariants}
              custom={0.7}
              initial="hidden"
              animate="visible"
              className="mt-4 flex gap-3"
            >
              <Button
                disabled
                variant="outline"
                className="flex h-14 flex-1 items-center justify-center gap-2 py-2"
              >
                <Image
                  src="/images/google-logo.svg"
                  alt="Google logo"
                  width={20}
                  height={20}
                />
                <span className="font-sketch text-sketch-fg">Google</span>
              </Button>
            </motion.div>

            <motion.p
              variants={divVariants}
              custom={0.8}
              initial="hidden"
              animate="visible"
              className="mt-6 text-center font-sketch text-sm text-sketch-fg/60"
            >
              Ainda não tem uma conta?{' '}
              <span
                onClick={handleGotoRegister}
                className="cursor-pointer text-sketch-accent hover:underline"
              >
                Cadastre-se
              </span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Page() {
  return (
    <LoginPageOverlayProvider>
      <main
        className="auth-page-light flex min-h-screen items-center justify-center p-4"
        style={{
          backgroundImage: "url('/images/food_background.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <LoginForm />
      </main>
    </LoginPageOverlayProvider>
  );
}
