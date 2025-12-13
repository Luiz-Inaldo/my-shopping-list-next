"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGeneralUserStore from "@/store/generalUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, ChevronLeft, CircleCheck, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileFormData } from "./schema/profileSchema";
import { APP_ROUTES } from "@/routes/app-routes";

export default function ProfilePage() {
  const { userProfile } = useGeneralUserStore();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    },
  });

  const watchedName = watch("name");
  const watchedEmail = watch("email");

  const hasChanges =
    watchedName !== (userProfile?.name || "") ||
    watchedEmail !== (userProfile?.email || "");

  function handleToggleEdit() {
    if (isEditing) {
      // Cancelar: resetar para os valores originais da store
      reset({
        name: userProfile?.name || "",
        email: userProfile?.email || "",
      });
    }
    setIsEditing(!isEditing);
  }

  function onSubmit(data: ProfileFormData) {
    // Lógica de salvamento será implementada posteriormente
    console.log("Salvar alterações:", data);
  }

  return (
    <>
      <Header className="text-lg font-medium">
        <Link href={APP_ROUTES.private.settings.name} className="flex items-center gap-1 text-subtitle">
          <ChevronLeft size={20} />
        </Link>
        <span>Perfil</span>
      </Header>

      <main className="main-container px-5 pb-6 pt-6 flex flex-col justify-between">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-paragraph text-sm">Informações de Perfil</h2>
            <button
              type="button"
              onClick={handleToggleEdit}
              className="text-paragraph text-sm hover:text-subtitle transition-colors"
            >
              {isEditing ? "Cancelar" : "Editar"}
            </button>
          </div>

          <form
            id="profile-form"
            onSubmit={handleSubmit(onSubmit)}
            className="bg-app-container rounded-lg divide-y divide-border"
          >
            {/* Nome */}
            <div className="flex items-center gap-3 p-4">
              <User size={18} className="text-paragraph shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-paragraph text-xs">Nome</span>
                {isEditing ? (
                  <>
                    <Input
                      {...register("name")}
                      className="h-7 text-sm px-2 rounded-md"
                      placeholder="Digite seu nome"
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-subtitle text-sm">
                    {watchedName || "—"}
                  </span>
                )}
              </div>
            </div>

            {/* E-mail */}
            <div className="flex items-center gap-3 p-4">
              <AtSign size={18} className="text-paragraph shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-paragraph text-xs">E-mail</span>
                {isEditing ? (
                  <>
                    <Input
                      type="email"
                      {...register("email")}
                      className="h-7 text-sm px-2 rounded-md"
                      placeholder="Digite seu e-mail"
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-subtitle text-sm">
                    {watchedEmail || "—"}
                  </span>
                )}
              </div>
            </div>
          </form>
        </section>

        <Button
          type="submit"
          form="profile-form"
          disabled={!hasChanges}
          className="w-full"
        >
          <CircleCheck size={18} />
          Salvar alterações
        </Button>
      </main>
    </>
  );
}
