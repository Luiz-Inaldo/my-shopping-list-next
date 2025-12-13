"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, CircleCheck, Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { securitySchema, type SecurityFormData } from "./schema/securitySchema";
import { APP_ROUTES } from "@/routes/app-routes";

export default function SecurityPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    // Lógica de submit será implementada posteriormente
    console.log(formData);
  }

  return (
    <>
      <Header className="text-lg font-medium">
        <Link href={APP_ROUTES.private.settings.name} className="flex items-center gap-1 text-subtitle">
          <ChevronLeft size={20} />
        </Link>
        <span>Segurança</span>
      </Header>

      <main className="main-container px-5 pb-6 pt-6 flex flex-col justify-between">
        <section className="flex flex-col gap-10">
          <div>
            <h2 className="text-title text-base font-medium mb-1">Mudança de senha</h2>
            <p className="text-paragraph text-sm">
              Defina uma nova senha para sua conta preenchendo os campos abaixo
            </p>
          </div>

          <form
            id="security-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Nova senha */}


            <div className="flex flex-col gap-1 flex-1">
              <span className="text-subtitle text-sm">Nova senha</span>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  {...form.register("newPassword")}
                  className="rounded-full text-sm px-2 pr-8 h-10 bg-app-container"
                  placeholder="Digite sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-paragraph hover:text-subtitle transition-colors"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.newPassword && (
                <span className="text-xs text-red-500">
                  {form.formState.errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Confirme a nova senha */}
            <div className="flex flex-col gap-1 flex-1 mt-4">
              <span className="text-subtitle text-sm">Confirme a nova senha</span>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")}
                  className="h-10 text-sm px-2 pr-8 rounded-full bg-app-container"
                  placeholder="Confirme sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-paragraph hover:text-subtitle transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <span className="text-xs text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </span>
              )}
            </div>
          </form>
        </section>

        <Button
          type="submit"
          form="security-form"
          disabled={!hasChanges}
          className="w-full"
        >
          <Lock size={18} />
          Alterar senha
        </Button>
      </main>
    </>
  );
}
