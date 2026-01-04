"use client";
import { APP_ROUTES } from "@/routes/app-routes";
import { Check, Eye, EyeOff, HelpCircle, LoaderCircle, LogInIcon, X } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { loginFormSchema } from "@/zodSchema/loginForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageOverlay } from "@/context/PageOverlayContext";
import { ILoginUser } from "@/interfaces/user";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { sendToastMessage } from "@/functions/sendToastMessage";
import ForgotPasswordModal from "@/components/Modal/ForgotPasswordModal";

export default function LogInForm({
  setCurrentForm,
}: {
  setCurrentForm: (form: string) => void;
}) {
  const [loading, loadingTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const { handleChangeRoute } = usePageOverlay();

  const form = useForm<ILoginUser>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
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
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          sendToastMessage({
            title: "Erro ao fazer login. Tente novamente.",
            type: "error"
          })
          return;
        }

        sendToastMessage({
          title: "Login realizado com sucesso.",
          type: "success"
        })
        setTimeout(() => {
          toast.dismiss();
          handleChangeRoute(APP_ROUTES.private.home.name);
        }, 2000);
      } catch (error) {
        if (error instanceof FirebaseError) {
          console.error(error.code);
          switch (error.code) {
            case "auth/invalid-credential":
              sendToastMessage({
                title: "Credenciais incorretas. Tente novamente.",
                type: "error"
              })
              break;

            default:
              sendToastMessage({
                title: "Erro ao fazer login. Tente novamente.",
                type: "error"
              })
              break;
          }
        }
      }

    })
  }

  return (
    <div className="w-full h-full rounded-tr-3xl rounded-tl-3xl border border-gray-200 bg-white p-5 shadow-md">

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 h-full"
        >
          <div className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu e-mail" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type={isPasswordVisible ? "text" : "password"} placeholder="Sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                  {isPasswordVisible ? (
                    <EyeOff
                      size={14}
                      className="absolute right-2 top-[34px] text-gray-400 cursor-pointer"
                      onClick={() => setIsPasswordVisible(false)}
                    />
                  ) : (
                    <Eye
                      size={14}
                      className="absolute right-2 top-[34px] text-gray-400 cursor-pointer"
                      onClick={() => setIsPasswordVisible(true)}
                    />
                  )}
                </FormItem>
              )}
            />
          </div>
          <ForgotPasswordModal
            email={form.getValues('email')}
            trigger={
              <Button variant="link" className="p-0 w-fit ml-auto text-default-green">
                <span>Esqueci minha senha</span>
              </Button>
            }
          />
          <div className="space-y-6">
            <Button type="submit" className="w-full uppercase">
              {loading ? (
                <>
                  <span>Autenticando...</span>
                  <LoaderCircle className="animate-spin" size={18} />
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <LogInIcon size={18} />
                </>
              )}
            </Button>
            <p className="text-sm text-center text-gray-500">
              Não possui uma conta?{" "}
              <span
                onClick={() => setCurrentForm("register")}
                className="text-default-green cursor-pointer"
              >
                Cadastre-se
              </span>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
