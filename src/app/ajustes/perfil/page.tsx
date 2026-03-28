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
import { profileSchema, type ProfileFormData } from "@/zodSchema/profile";
import { APP_ROUTES } from "@/routes/app-routes";
import { updateUserEmail, updateUserName } from "@/services/account";
import ReauthenticateModal from "@/components/Modal/ReauthenticateModal";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TUserProfileProps } from "@/types/user";
import { useRouter } from "next/navigation";

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

    editingDataTransition(async () => {

      try {
        if (formData.name && dirtyFields.name) {
          await updateUserName(userProfile?.uid || "", formData.name);
        }

        if (formData.email && dirtyFields.email) {
          await updateUserEmail(formData.password ?? "", formData.email);
          sendToastMessage({
            title: "Um e-mail de verificação foi enviado para seu novo endereço. Verifique sua caixa de entrada/spam e clique no link para confirmar a mudança.",
            type: "success"
          })
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
    <div className="sketch-shell min-h-screen flex flex-col">
      <Header className="text-2xl font-sketchHeading">
        <Link href={APP_ROUTES.private.settings.name} className="flex items-center gap-1 text-sketch-fg">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </Link>
        <span>Perfil</span>
      </Header>

      <main className="flex-1 px-5 pb-6 pt-6 flex flex-col justify-between max-w-2xl mx-auto w-full">
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-sketch-fg font-sketchHeading text-xl">Informações de Perfil</h2>
            <button
              type="button"
              onClick={handleToggleEdit}
              className="text-sketch-accent font-sketch text-lg hover:underline transition-colors"
            >
              {isEditing ? "Cancelar" : "Editar"}
            </button>
          </div>

          <form
            id="profile-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Nome */}
            <div className="flex items-center gap-3">
              <User size={22} strokeWidth={2.5} className="text-sketch-accent shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-sketch-fg/60 font-sketchHeading">Nome</span>
                {isEditing ? (
                  <>
                    <Input
                      {...form.register("name")}
                      className="h-10 text-base"
                      placeholder="Digite seu nome"
                    />
                    {form.formState.errors.name && (
                      <span className="text-sm text-sketch-danger font-sketch">
                        {form.formState.errors.name.message}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sketch-fg font-sketch text-lg">
                    {userProfile?.name || "—"}
                  </span>
                )}
              </div>
            </div>

            {/* E-mail */}
            <div className="flex items-center gap-3">
              <AtSign size={22} strokeWidth={2.5} className="text-sketch-accent shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-sketch-fg/60 font-sketchHeading">E-mail</span>
                {isEditing ? (
                  <>
                    <Input
                      type="email"
                      {...form.register("email")}
                      className="h-10 text-base"
                      placeholder="Digite seu e-mail"
                    />
                    {form.formState.errors.email && (
                      <span className="text-sm text-sketch-danger font-sketch">
                        {form.formState.errors.email.message}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sketch-fg font-sketch text-lg">
                    {userProfile?.email || "—"}
                  </span>
                )}
              </div>
            </div>
          </form>
        </section>

        <ReauthenticateModal
          trigger={
            <div className="mt-10">
              <Button
                type="button"
                form="profile-form"
                disabled={!hasChanges || isEditingData}
                className="w-full text-lg h-12"
              >
                {isEditingData ? <LoaderCircle size={22} className='animate-spin' /> : <CircleCheck size={22} strokeWidth={2.5} />}
                Salvar alterações
              </Button>
            </div>
          } confirmButtonFn={() => form.handleSubmit(onSubmit)()}
          form={form}
        />
      </main>
    </div>
  );
}
