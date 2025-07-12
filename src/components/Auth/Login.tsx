"use client";
import useMySwal from "@/hooks/useMySwal";
import { User } from "@/interfaces/user";
import { supabase } from "@/lib/api";
import { APP_ROUTES } from "@/routes/app-routes";
import { Eye, EyeOff, LoaderCircle, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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

export default function LogInForm({
  setCurrentForm,
}: {
  setCurrentForm: (form: string) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const swal = useMySwal();

  const router = useRouter();
  const form = useForm<User>();

  async function onSubmit(userCredentials: User) {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword(
      userCredentials
    );

    if (error) {
      if (error.code === "invalid_credentials") {
        swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Credenciais de login inválidas, ou não existem.",
          confirmButtonText: "Ok",
        });
      } else {
        swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Houve um erro ao tentar o login.",
          confirmButtonText: "Ok",
        });
      }
    } else {
      swal.fire({
        icon: "success",
        toast: true,
        position: "bottom-right",
        text: "Login realizado com sucesso.",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      setTimeout(() => router.push(APP_ROUTES.private.home.name), 2000);
    }

    setLoading(false);
  }

  return (
    <div className="w-full h-full rounded-tr-3xl rounded-tl-3xl border border-gray-200 bg-white p-5 shadow-md">
      {/* <h2 className="text-2xl leading-[1] uppercase text-center text-subtitledark mb-5 border-b border-[#DDD]">
        SignIn
      </h2> */}
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
