import { cn } from "@/lib/utils";
import useGeneralUserStore from "@/store/generalUserStore";
import { ChevronRight, Info, Trash2 } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/routes/app-routes";

export function OtherSettingsSection() {

  const userProfile = useGeneralUserStore(store => store.userProfile);

  return (
    <section className={cn(userProfile?.emailPendencies && "cursor-not-allowed pointer-events-none")}>
      <h2 className="text-paragraph text-sm mb-3">Outras configurações</h2>
      <div className="bg-app-container rounded-lg divide-y divide-border">
        <Link href={APP_ROUTES.private.settings.sobre.name} className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3 text-subtitle">
            <Info size={18} />
            <span className="text-sm">Sobre o aplicativo</span>
          </div>
          <ChevronRight size={18} className="text-paragraph" />
        </Link>
        <Link href={APP_ROUTES.private.settings.deletarConta.name} className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3 text-red-500">
            <Trash2 size={18} />
            <span className="text-sm">Deletar minha conta</span>
          </div>
          <ChevronRight size={18} className="text-red-500" />
        </Link>
      </div>
    </section>
  );
}

