"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoggedLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sendToastMessage } from "@/functions/sendToastMessage";
import useMySwal from "@/hooks/useMySwal";
import { supabase } from "@/lib/api";
import { APP_ROUTES } from "@/routes/app-routes";
import useGeneralUserStore from "@/store/generalUserStore";
import { Blocks, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Menu() {
  
  const userProfile = useGeneralUserStore((store) => store.userProfile);
  const resetProfile = useGeneralUserStore((store) => store.resetProfile);

  const router = useRouter();

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      sendToastMessage({ title: "Erro ao fazer logout", type: "error" });
    } else {
      sendToastMessage({ title: "Logout realizado com sucesso", type: "success" });
      resetProfile();
      setTimeout(() => {
        toast.dismiss();
        router.push(APP_ROUTES.public.auth.name)
      }, 3000);
    }
  }

  return (
    <LoggedLayout>
      <Header
        content={(_) => (
          <div className="flex items-center gap-3 cursor-pointer overflow-hidden">
            <Avatar className="border-2 border-app-container">
              <AvatarImage src={userProfile?.profile_img} />
              <AvatarFallback>
                <Image
                  src="/images/avatars/default-avatar.svg"
                  alt="no-profile-img"
                  width={28}
                  height={28}
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-title">
                {userProfile?.user_name || "Usuário sem nome."}
              </p>
              <Link
                href={APP_ROUTES.private.settings.name}
                className="text-xs text-link underline"
              >
                Acessar o perfil
              </Link>
            </div>
          </div>
        )}
      />

      <div className="main-container py-28 px-5 flex flex-col gap-10">
        <h1 className="text-subtitle text-xl font-bold">Menu</h1>
        <div className="flex flex-col gap-3 text-paragraph">
          <Link href={"#"} className="flex gap-4">
            <Blocks size={20} />
            <span>Sobre o aplicativo</span>
          </Link>
          <button className="flex gap-4" onClick={logout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <Footer />
    </LoggedLayout>
  );
}
