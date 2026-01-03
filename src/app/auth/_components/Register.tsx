"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, LoaderCircle, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { registerFormSchema } from "@/types/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { IRegisterUser } from "@/interfaces/user";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { useQuery } from "@tanstack/react-query";
import { createUsernameQueryOptions } from "@/hooks/queries/usernames";
import { debounce } from "@/functions/debounce";

export default function RegisterForm() {
  const [loading, registerTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const form = useForm<IRegisterUser>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // ===============
  // # react query
  // ===============
  const { data: usernamesList } = useQuery(createUsernameQueryOptions());

  // ===============
  // # Constants & Variables
  // ===============
  const username = form.watch("username");
  const verifyUsernameAvailability = useMemo(
    () =>
      debounce(() => {
        if (username && usernamesList?.list) {
          setIsUsernameAvailable(!usernamesList.list.includes(username));
        }
      }, 1_000),
    [username, usernamesList]
  );

  async function onSubmit(userCredentials: IRegisterUser) {
    const { email, password, username: profileUsername } = userCredentials;

    registerTransition(async () => {
      try {
        // Create user account
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = user.user.uid;

        if (user.user) {
          await sendEmailVerification(user.user);
        }

        sendToastMessage({
          title: "Usuário criado com sucesso!",
          type: "success",
        });

        try {
          // Create user profile in database
          await setDoc(doc(db, "users", uid), {
            uid,
            email,
            name: profileUsername,
            role: searchParams.get("adminregister") ? "admin" : "user",
            premium: {
              status: false,
              expires_at: null,
            },
            profile_img: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Create document with unique username
          await setDoc(doc(db, "usernames", profileUsername), {
            uuid: uid,
          });
        } catch (error) {
          if (error instanceof FirebaseError) {
            sendToastMessage({
              title: "Houve um erro ao criar o perfil.",
              type: "error",
            });
          }
        }
      } catch (error) {
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case "auth/email-already-in-use":
              sendToastMessage({
                title: "Email ja cadastrado.",
                type: "error",
              });
              break;

            case "auth/invalid-email":
              sendToastMessage({
                title: "Email inválido.",
                type: "error",
              });
              break;

            default:
              sendToastMessage({
                title: "Houve um erro ao criar o usuário.",
                type: "error",
              });
              break;
          }
        }
      }
    });
  }

  useEffect(() => {
    if (username && usernamesList?.list) {
      verifyUsernameAvailability();
    }
  }, [username, usernamesList, verifyUsernameAvailability]);

  return (
    <div className="w-full h-full rounded-tr-3xl rounded-tl-3xl border border-gray-200 bg-white p-5 shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="relative">
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
            {username && (
              <>
                {isUsernameAvailable ? (
                  <span className="absolute top-1.5 right-2 text-xs text-app-primary">
                    Nome de usuário disponível
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-2 text-xs text-destructive">
                    Nome de usuário já utilizado
                  </span>
                )}
              </>
            )}
          </div>
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
                <FormLabel>Email: </FormLabel>
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
                      placeholder="Digite a sua senha"
                      {...field}
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
                      placeholder="Digite a sua senha novamente"
                      {...field}
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
          <Button disabled={(username && !isUsernameAvailable) || loading} type="submit" className="w-full uppercase !mt-7">
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
