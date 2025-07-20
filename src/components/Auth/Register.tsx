'use client'
import useMySwal from '@/hooks/useMySwal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterProps } from '@/interfaces/user';
import { supabase } from '@/lib/api';
import { Check, Eye, EyeOff, LoaderCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { registerFormSchema } from '@/types/zodTypes';
import { zodResolver } from '@hookform/resolvers/zod';

export default function RegisterForm() {

  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const swal = useMySwal();

  const router = useRouter();
  const form = useForm<RegisterProps>({
    resolver: zodResolver(registerFormSchema)
  });

  async function onSubmit(userCredentials: RegisterProps) {

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: userCredentials.email,
      password: userCredentials.password,
    });

    const { error: profileError } = await supabase.from('profiles').insert({
      email: userCredentials.email,
      user_name: userCredentials.username,
      profile_img: ''
    });

    if (signUpError) {
      toast.error("Houve algum problema ao cadastrar o usuário", {
        classNames: {
          toast: '!bg-black !border-0',
          title: '!text-snow'
        },
        position: 'top-center',
        icon: <X className="text-red-500 text-lg" />
      });
    } else if (profileError) {
      toast.error("O usuário foi cadastrado e você receberá um e-mail, porém houve algum problema ao criar o perfil. Contate o administrador.", {
        classNames: {
          toast: '!bg-black !border-0',
          title: '!text-snow'
        },
        position: 'top-center',
        icon: <X className="text-red-500 text-lg" />
      });
    } else {
      toast.error("Cadastro realizado com sucesso. Voce receberá um e-mail para confirmar seu cadastro", {
        classNames: {
          toast: '!bg-black !border-0',
          title: '!text-snow'
        },
        position: 'top-center',
        icon: <Check className="text-emerald-500 text-lg" />
      });
      form.reset();
    }

    setLoading(false);

  };

  return (
    <div className="w-full h-full rounded-tr-3xl rounded-tl-3xl border border-gray-200 bg-white p-5 shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário: </FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome de usuário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <label htmlFor="username" className="relative">
            <span className="text-[#212121] font-semibold text-sm">Usuário:</span>
            <input
              type="text"
              placeholder="Digite o nome de usuário"
              {...register("username", {
                required: true,
                minLength: {
                  value: 4,
                  message: "Deve conter no mínimo 4 caracteres.",
                },
                maxLength: {
                  value: 20,
                  message: "Deve conter no máximo 20 caracteres.",
                },
                pattern: {
                  value: /^[a-zA-Z]+$/,
                  message: "Deve conter apenas letras.",
                },
              })}
              className="text-sm w-full text-gray-500 rounded-full border border-gray-300 px-3 py-2 h-8"
            />
            {errors.username && (
              <span className="text-xs text-red-500">
                {errors.username.message}
              </span>
            )}
          </label> */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário: </FormLabel>
                <FormControl>
                  <Input placeholder="Digite o seu e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <label htmlFor="email" className="relative">
            <span className="text-[#212121] font-semibold text-sm">E-mail:</span>
            <input
              type="text"
              placeholder="Digite seu e-mail"
              {...register("email", {
                required: {
                  value: true,
                  message: "Campo obrigatório.",
                },
              })}
              className="text-sm w-full text-gray-500 rounded-full border border-gray-300 px-3 py-2 h-8"
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </label> */}
          <div className="relative">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha: </FormLabel>
                  <FormControl>
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Digite a sua senha" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPasswordVisible ? (
              <EyeOff
                size={14}
                className="absolute right-2 top-[36px] text-gray-400 cursor-pointer"
                onClick={() => setIsPasswordVisible(false)}
              />
            ) : (
              <Eye
                size={14}
                className="absolute right-2 top-[36px] text-gray-400 cursor-pointer"
                onClick={() => setIsPasswordVisible(true)}
              />
            )}
          </div>
          {/* <label htmlFor="password" className="relative">
            <span className="text-[#212121] font-semibold text-sm">Senha:</span>
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Digite sua senha"
              {...register("password", {
                required: true,
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Deve conter: letra maiúscula, minúscula, número e caractere especial.",
                },
              })}
              className="text-sm w-full text-gray-500 rounded-full border border-gray-300 px-3 py-2 h-8"
            />

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

            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </label> */}
          <div className="relative">
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha:</FormLabel>
                  <FormControl>
                    <Input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      placeholder="Digite a sua senha novamente" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isConfirmPasswordVisible ? (
              <EyeOff
                size={14}
                className="absolute right-2 top-[36px] text-gray-400 cursor-pointer"
                onClick={() => setIsConfirmPasswordVisible(false)}
              />
            ) : (
              <Eye
                size={14}
                className="absolute right-2 top-[36px] text-gray-400 cursor-pointer"
                onClick={() => setIsConfirmPasswordVisible(true)}
              />
            )}
          </div>
          {/* <label htmlFor="confirm_password" className="relative">
            <span className="text-[#212121] font-semibold text-sm">Confirmar Senha:</span>
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              placeholder="Digite sua senha novamente"
              {...register("confirm_password", {
                required: {
                  value: true,
                  message: "É necessário confirmar sua senha.",
                },
              })}
              className="text-sm w-full text-gray-500 rounded-full border border-gray-300 px-3 py-2 h-8"
            />

            {isConfirmPasswordVisible ? (
              <EyeOff
                size={14}
                className="absolute right-2 top-[34px] text-gray-400 cursor-pointer"
                onClick={() => setIsConfirmPasswordVisible(false)}
              />
            ) : (
              <Eye
                size={14}
                className="absolute right-2 top-[34px] text-gray-400 cursor-pointer"
                onClick={() => setIsConfirmPasswordVisible(true)}
              />
            )}

            {errors.confirm_password && (
              <span className="text-xs text-red-500">
                {errors.confirm_password.message}
              </span>
            )}
          </label> */}
          <Button
            type="submit"
            className="w-full uppercase !mt-7"
          >
            {loading ? (
              <>
                <span>Cadastrando usuário...</span>
                <LoaderCircle className="animate-spin" size={18} />
              </>
            ) : (
              <>
                <span>Criar conta</span>
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
