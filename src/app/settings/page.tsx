"use client";
import Header from "@/components/Header";
import LoggedLayout from "@/components/layout/MainLayout";
import ChangeAvatarModal from "@/components/Modal/ChangeAvatarModal";
import ThemeSwitcher from "@/components/Switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/lib/api";
import getProfile from "@/services/userProfileServices";
import useGeneralUserStore from "@/store/generalUserStore";
import { EllipsisVertical, Lock, Palette, Pencil } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";

export default function Settings() {
  const user = useGeneralUserStore((store) => store.user);
  const userProfile = useGeneralUserStore((store) => store.userProfile);
  const setUserProfile = useGeneralUserStore((store) => store.setUserProfile);

  const { theme, toggleTheme } = useTheme();

  async function removeAvatar() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ profile_img: "" })
        .eq("email", user?.email);
      fetchProfile();
      toast({
        title: "Avatar removido com sucesso!",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao remover avatar",
        description: "Tente novamente mais tarde",
        variant: "destructive",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
    }
  }

  async function fetchProfile() {
    const profileData = await getProfile(user?.email);
    setUserProfile(profileData);
  }

  return (
    <LoggedLayout>
      <Header
        content={(_) => <h2 className="text-title text-lg">Ajustes</h2>}
      />
      <main className="main-container py-28 px-5 flex flex-col gap-8">
        <div className="flex gap-5 items-center bg-app-container border border-border shadow-md p-4 rounded-sm">
          <div className="relative">
            <Avatar className="w-[70px] h-[70px]">
              <AvatarImage src={userProfile?.profile_img} />
              <AvatarFallback>
                <Image
                  src="/images/avatars/default-avatar.png"
                  alt="no-profile-img"
                  width={50}
                  height={50}
                />
              </AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer absolute p-0 bottom-0 right-0 flex items-center justify-center w-5 h-5 rounded-full bg-secondary-blue">
                <EllipsisVertical size={12} className="text-snow" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
                <ChangeAvatarModal
                  currentAvatarUrl={userProfile?.profile_img}
                  refetch={fetchProfile}
                >
                  Alterar imagem
                </ChangeAvatarModal>
                <DropdownMenuItem onClick={removeAvatar}>
                  Remover imagem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-subtitle font-semibold">
              {userProfile?.user_name || "Usuário sem nome."}
            </p>
            <p className="text-sm text-paragraph">{userProfile?.email}</p>
          </div>
        </div>
        <div>
          <h2 className="text-subtitle mb-3">Ajustes do perfil</h2>
          <div className="grid gap-3 bg-app-container border border-border shadow-md p-4 rounded-sm">
            <div className="flex gap-3 items-center text-subtitle">
              <Lock size={16} />
              <p className="text-sm">Alterar senha</p>
            </div>
            <div className="flex gap-3 items-center text-subtitle">
              <Pencil size={16} />
              <p className="text-sm">Alterar apelido</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-subtitle mb-3">Ajustes do sistema</h2>
          <div className="grid gap-3 bg-app-container border border-border shadow-md p-4 rounded-sm">
            <div className="flex gap-3 items-center justify-between text-subtitle">
              <div className="flex gap-3 items-center">
                <Palette size={16} />
                <p className="text-sm">Tema: {theme === "dark" ? "Escuro" : "Claro"}</p>
              </div>
              <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>
        </div>
      </main>
    </LoggedLayout>
  );
}
