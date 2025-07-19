'use client'
import useMySwal from '@/hooks/useMySwal';
import { RegisterProps } from '@/interfaces/user';
import { supabase } from '@/lib/api';
import { Check, Eye, EyeOff, LoaderCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function RegisterForm() {

  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const swal = useMySwal();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterProps>();

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
    }

    setLoading(false);

  };

  return (
    <div className="w-full h-full rounded-tr-3xl rounded-tl-3xl border border-gray-200 bg-white p-5 shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <label htmlFor="username" className="relative">
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
        </label>
        <label htmlFor="email" className="relative">
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
        </label>
        <label htmlFor="password" className="relative">
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
        </label>
        <label htmlFor="confirm_password" className="relative">
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
        </label>
        <button
          type="submit"
          className="w-full uppercase flex gap-2 items-center justify-center bg-default-green py-2 px-3 rounded-full text-snow mt-5"
        >
          {loading ? (
            <>
              <span>Cadastrando usuário...</span>
              <LoaderCircle className="animate-spin" size={18} />
            </>
          ) : (
            <>
              <span>Registrar</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
