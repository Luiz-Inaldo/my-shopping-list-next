"use client";
import { APP_ROUTES } from "@/routes/app-routes";
import { ChevronRight, Info, LogOut, Trash2 } from "lucide-react";
import Link from "next/link";
import useGeneralUserStore from "@/store/generalUserStore";
import { deleteAuthToken } from "@/functions/logout";
import { tryCatchRequest } from "@/functions/requests";
import { sendToastMessage } from "@/functions/sendToastMessage";
import { useState } from "react";
import { AppLoader } from "@/components/Loader/app-loader";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export function MenuOptionsSection() {
  const [isUnlogging, setIsUnlogging] = useState<boolean>(false);
  const resetProfile = useGeneralUserStore((store) => store.resetProfile);
  const router = useRouter();

  async function handleLogout() {
    setIsUnlogging(true);

    const [_, err] = await tryCatchRequest<void, FirebaseError>(signOut(auth));

    if (err) {
      console.error(err.code);
      sendToastMessage({
        title: err.code,
        type: "error",
      });
      setIsUnlogging(false);
      return;
    }

    await deleteAuthToken()

    sendToastMessage({
      title: "Logout realizado com sucesso!",
      type: "success",
    });
    setIsUnlogging(false);
    resetProfile();
    router.push(APP_ROUTES.public.inicio.name);
  }

  return (
    <section className="font-sketch">
      <div className="bg-sketch-white border-[3px] border-sketch-border rounded-sketch-card shadow-sketch rotate-1 divide-y divide-dashed divide-sketch-fg/10 overflow-hidden">
        <Link
          href={APP_ROUTES.private.menu.sobre.name}
          className="w-full flex items-center justify-between p-5 hover:bg-sketch-accent-lt transition-colors"
        >
          <div className="flex items-center gap-4 text-sketch-fg">
            <Info size={22} strokeWidth={2.5} className="text-sketch-accent" />
            <span className="text-lg">Sobre o aplicativo</span>
          </div>
          <ChevronRight size={22} strokeWidth={2.5} className="text-sketch-fg/40" />
        </Link>

        <Link
          prefetch
          href={APP_ROUTES.private.menu.deletarConta.name}
          className="w-full flex items-center justify-between p-5 hover:bg-sketch-danger/10 transition-colors"
        >
          <div className="flex items-center gap-4 text-sketch-danger">
            <Trash2 size={22} strokeWidth={2.5} />
            <span className="text-lg">Deletar minha conta</span>
          </div>
          <ChevronRight size={22} strokeWidth={2.5} className="text-sketch-danger/40" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-5 hover:bg-sketch-accent-lt transition-colors"
        >
          <div className="flex items-center gap-4 text-sketch-fg text-lg">
            {isUnlogging ? (
              <AppLoader size={22} />
            ) : (
              <LogOut size={22} strokeWidth={2.5} className="text-sketch-accent" />
            )}
            <span>Sair</span>
          </div>
          <ChevronRight size={22} strokeWidth={2.5} className="text-sketch-fg/40" />
        </button>
      </div>
    </section>
  );
}
