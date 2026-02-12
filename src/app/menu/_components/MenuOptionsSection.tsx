"use client";
import { APP_ROUTES } from "@/routes/app-routes";
import { ChevronRight, Info, LogOut, Trash2 } from "lucide-react";
import Link from "next/link";
import useGeneralUserStore from "@/store/generalUserStore";
import { LogOut as logoutFunction } from "@/functions/logout";
import { tryCatchRequest } from "@/functions/requests";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { useState } from "react";
import { AppLoader } from "@/components/Loader/app-loader";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

export function MenuOptionsSection() {
  const [isUnlogging, setIsUnlogging] = useState<boolean>(false);
  const resetProfile = useGeneralUserStore((store) => store.resetProfile);
  const router = useRouter();

  async function handleLogout() {
    setIsUnlogging(true);
    const [_, err] = await tryCatchRequest<void, FirebaseError>(logoutFunction());
    if (err) {
      console.error(err.code);
      sendToastMessage({
        title: err.code,
        type: "error",
      });
      setIsUnlogging(false);
      return;
    }

    sendToastMessage({
      title: "Logout realizado com sucesso!",
      type: "success",
    });
    setIsUnlogging(false);
    resetProfile();
    router.push(APP_ROUTES.public.inicio.name);
  }

  return (
    <section>
      <div className="bg-app-container rounded-lg divide-y divide-border">
        <Link
          href={APP_ROUTES.private.settings.sobre.name}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3 text-subtitle">
            <Info size={18} />
            <span className="text-sm">Sobre o aplicativo</span>
          </div>
          <ChevronRight size={18} className="text-paragraph" />
        </Link>
        <Link
          prefetch
          href={APP_ROUTES.private.settings.deletarConta.name}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3 text-red-500">
            <Trash2 size={18} />
            <span className="text-sm">Deletar minha conta</span>
          </div>
          <ChevronRight size={18} className="text-red-500" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3 text-subtitle">
            {isUnlogging ? (
              <AppLoader size={18} />
            ) : (
              <LogOut size={18} />
            )}
            <span className="text-sm">Sair</span>
          </div>
          <ChevronRight size={18} className="text-paragraph" />
        </button>
      </div>
    </section>
  );
}
