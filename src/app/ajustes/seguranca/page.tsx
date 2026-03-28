"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, CircleCheck, Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { securitySchema, type SecurityFormData } from "@/zodSchema/security";
import { APP_ROUTES } from "@/routes/app-routes";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { updateUserPassword } from "@/services/account";
import { tryCatchRequest } from "@/functions/requests";
import ReauthenticateModal from "@/components/Modal/ReauthenticateModal";
import { AppLoader } from "@/components/Loader/app-loader";
import { FirebaseError } from "firebase/app";

export default function SecurityPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, updatingPasswordTransition] = useTransition();

  const form = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      password: "",
    },
  });

  const hasChanges = form.formState.isDirty;

  function onSubmit(formData: SecurityFormData) {
    updatingPasswordTransition(async () => {
      const [response, error] = await tryCatchRequest<boolean, FirebaseError>(
        updateUserPassword(formData.password ?? "", formData.newPassword)
      );

      if (response) {
        sendToastMessage({
          title: "Senha atualizada com sucesso. No próximo acesso, utilize a nova senha.",
          type: "success"
        });
        form.reset({
          newPassword: "",
          confirmPassword: "",
          password: "",
        });
        return;
      }

      if (error) {
        if (error.code === "auth/invalid-credential") {
          sendToastMessage({
            title: "Senha atual inválida",
            type: "error"
          });
          return;
        } else {
          sendToastMessage({
            title: error.code || "Erro ao atualizar a senha",
            type: "error"
          });
        }
      }

    });
  }

  return (
    <div className="sketch-shell min-h-screen flex flex-col">
      <Header className="text-2xl font-sketchHeading">
        <Link href={APP_ROUTES.private.settings.name} className="flex items-center gap-1 text-sketch-fg">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </Link>
        <span>Segurança</span>
      </Header>

      <main className="flex-1 px-5 pb-6 pt-6 flex flex-col justify-between max-w-2xl mx-auto w-full">
        <section className="flex flex-col gap-8">
          <div>
            <h2 className="text-sketch-fg font-sketchHeading text-xl mb-1">Mudança de senha</h2>
            <p className="text-sketch-fg/60 font-sketch text-lg leading-tight">
              Defina uma nova senha para sua conta preenchendo os campos abaixo
            </p>
          </div>

          <form
            id="security-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Nova senha */}
            <div className="flex flex-col gap-2">
              <span className="text-sketch-fg/60 font-sketchHeading">Nova senha</span>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  {...form.register("newPassword")}
                  className="pr-12 h-12 text-lg"
                  placeholder="Digite sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sketch-accent hover:text-sketch-fg transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <span className="text-sm text-sketch-danger font-sketch">
                  {form.formState.errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirme a nova senha */}
            <div className="flex flex-col gap-2">
              <span className="text-sketch-fg/60 font-sketchHeading">Confirme a nova senha</span>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")}
                  className="pr-12 h-12 text-lg"
                  placeholder="Confirme sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sketch-accent hover:text-sketch-fg transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <span className="text-sm text-sketch-danger font-sketch">
                  {form.formState.errors.confirmPassword.message}
                </span>
              )}
            </div>
          </form>
        </section>

        <ReauthenticateModal
          trigger={
            <div className="mt-10">
              <Button
                type="button"
                form="security-form"
                disabled={!hasChanges || isUpdatingPassword}
                className="w-full text-lg h-12"
              >
                {isUpdatingPassword ? <>
                  <AppLoader size={22} />
                  Salvando...
                </> : <>
                  <Lock size={22} strokeWidth={2.5} />
                  Salvar alterações
                </>}
              </Button>
            </div>
          } confirmButtonFn={() => form.handleSubmit(onSubmit)()}
          form={form}
        />
      </main>
    </div>
  );
}
