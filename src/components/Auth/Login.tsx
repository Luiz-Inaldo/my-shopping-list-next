"use client";
import { APP_ROUTES } from "@/routes/app-routes";
import { Check, Eye, EyeOff, LoaderCircle, LogInIcon, X } from "lucide-react";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { loginFormSchema } from "@/types/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageOverlay } from "@/context/PageOverlayContext";
import { ILoginUser } from "@/interfaces/user";

export default function LogInForm({
  setCurrentForm,
}: {
  setCurrentForm: (form: string) => void;
}) {
  const [loading, loadingTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const { handleChangeRoute } = usePageOverlay();

  const form = useForm<ILoginUser>({
    resolver: zodResolver(loginFormSchema)
  });

  async function onSubmit(userCredentials: ILoginUser) {
    loadingTransition(async () => {

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userCredentials)
      });

      if (res.status === 200) {
        toast.success("Login realizado com sucesso.", {
          classNames: {
            toast: '!bg-black !border-0',
            title: '!text-snow'
          },
          position: 'top-center',
          icon: <Check className="text-emerald-500 text-lg" />
        });
        setTimeout(() => {
          toast.dismiss();
          handleChangeRoute(APP_ROUTES.private.home.name);
        }, 2000);
      } else {
        switch (res.statusText) {
          case "auth/invalid-credential":
            toast.error("Credenciais incorretas. Tente novamente.", {
              classNames: {
                toast: '!bg-black !border-0',
                title: '!text-snow'
              },
              position: 'top-center',
              icon: <X className="text-red-500 text-lg" />
            });
            break;

          default:
            toast.error("Houve um erro ao logar.", {
              classNames: {
                toast: '!bg-black !border-0',
                title: '!text-snow'
              },
              position: 'top-center',
              icon: <X className="text-red-500 text-lg" />
            });
            break;
        }
      }
    });

    // const { data, error } = await supabase.auth.signInWithPassword(
    //   userCredentials
    // );

    // if (error) {
    //   if (error.code === "invalid_credentials") {
    //     toast.error("Credenciais de login inválidas.", {
    //       classNames: {
    //         toast: '!bg-black !border-0',
    //         title: '!text-snow'
    //       },
    //       position: 'top-center',
    //       icon: <X className="text-red-500 text-lg" />
    //     });
    //   } else {
    //     toast.error("Houve um erro ao logar.", {
    //       classNames: {
    //         toast: '!bg-black !border-0',
    //         title: '!text-snow'
    //       },
    //       position: 'top-center',
    //       icon: <X className="text-red-500 text-lg" />
    //     });
    //   }
    // } else {
    //   toast.success("Login realizado com sucesso.", {
    //     classNames: {
    //       toast: '!bg-black !border-0',
    //       title: '!text-snow'
    //     },
    //     position: 'top-center',
    //     icon: <Check className="text-emerald-500 text-lg" />
    //   });
    //   setTimeout(() => {
    //     toast.dismiss();
    //     handleChangeRoute(APP_ROUTES.private.home.name);
    //   }, 2000);
    // }

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
          <div className="space-y-2">
            <Button type="submit" className="w-full uppercase mt-5">
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
            <p className="text-sm text-center text-gray-500 mt-5">
              Ainda não tem uma conta?{" "}
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
