import { APP_ROUTES } from "@/routes/app-routes";
import { ChevronRight, Pencil, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function ProfileSection() {
  return (
    <section>
      <h2 className="text-paragraph text-sm mb-3">Perfil</h2>
      <div className="bg-app-container rounded-lg divide-y divide-border">
        <Link href={APP_ROUTES.private.settings.perfil.name} className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3 text-subtitle">
            <Pencil size={18} />
            <span className="text-sm">Editar perfil</span>
          </div>
          <ChevronRight size={18} className="text-paragraph" />
        </Link>
        <button className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3 text-subtitle">
            <ShieldCheck size={18} />
            <span className="text-sm">Segurança</span>
          </div>
          <ChevronRight size={18} className="text-paragraph" />
        </button>
      </div>
    </section>
  );
}

