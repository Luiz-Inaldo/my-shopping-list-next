"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGeneralUserStore from "@/store/generalUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, ChevronLeft, CircleCheck, LoaderCircle, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileFormData } from "./schema/profileSchema";
import { APP_ROUTES } from "@/routes/app-routes";
import { updateUserEmail, updateUserName } from "@/services/settings";
import ReauthenticateModal from "@/components/Modal/ReauthenticateModal";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { TUserProfileProps } from "@/types/user";
import { useRouter } from "next/navigation";
import { LogOut } from "@/functions/logout";

export default function ProfilePage() {
  const { userProfile, setUserProfile } = useGeneralUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingData, editingDataTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      password: "",
    },
  });

  const dirtyFields = form.formState.dirtyFields;
  const hasChanges = Object.keys(dirtyFields).length > 0;

  function handleToggleEdit() {
    if (isEditing) {
      form.reset({
        name: userProfile?.name || "",
        email: userProfile?.email || "",
      });
    }
    setIsEditing(!isEditing);
  }

  function onSubmit(formData: ProfileFormData) {
    // console.log('foi')
    // return;
    editingDataTransition(async () => {

      try {
        if (formData.name && dirtyFields.name) {
          await updateUserName(userProfile?.uid || "", formData.name);
        }

        if (formData.email && dirtyFields.email) {
          await updateUserEmail(formData.password ?? "", formData.email);
          sendToastMessage({
            title: "Um e-mail de verificação foi enviado para seu novo e-mail. Verifique sua caixa de entrada/spam e clique no link para confirmar a mudança de e-mail.",
            type: "success"
          })
          setTimeout(async () => {
            await LogOut();
            router.push(APP_ROUTES.public.auth.name);
          }, 2000);
          return;
        }
        sendToastMessage({
          title: "Dados atualizados com sucesso",
          type: "success"
        });
        handleToggleEdit()
      } catch (error) {
        console.error("Erro ao atualizar o nome do usuário:", error);
        sendToastMessage({
          title: "Erro ao atualizar dados do usuário",
          type: "error"
        });
      }

    });
  }

  useEffect(() => {

    const unsubscribe = onSnapshot(doc(db, "users", userProfile?.uid || ""), (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.data() as TUserProfileProps;
        setUserProfile(userData);
      }
    });

    return () => unsubscribe();
  }, [userProfile?.uid, setUserProfile]);

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
            onSubmit={form.handleSubmit(onSubmit)}
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
                      {...form.register("name")}
                      className="h-7 text-sm px-2 rounded-md"
                      placeholder="Digite seu nome"
                    />
                    {form.formState.errors.name && (
                      <span className="text-xs text-red-500">
                        {form.formState.errors.name.message}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-subtitle text-sm">
                    {userProfile?.name || "—"}
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
                      {...form.register("email")}
                      className="h-7 text-sm px-2 rounded-md"
                      placeholder="Digite seu e-mail"
                    />
                    {form.formState.errors.email && (
                      <span className="text-xs text-red-500">
                        {form.formState.errors.email.message}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-subtitle text-sm">
                    {userProfile?.email || "—"}
                  </span>
                )}
              </div>
            </div>
          </form>
        </section>

        <ReauthenticateModal
          trigger={
            <Button
              type="button"
              form="profile-form"
              disabled={!hasChanges || isEditingData}
              className="w-full"
            >
              {isEditingData ? <LoaderCircle size={18} className='animate-spin' /> : <CircleCheck size={18} />}
              Salvar alterações
            </Button>
          } confirmButtonFn={() => form.handleSubmit(onSubmit)()}
          form={form}
        />
      </main>
    </>
  );
}
