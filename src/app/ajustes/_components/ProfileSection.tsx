import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/routes/app-routes";
import { ChevronRight, Pencil, ShieldCheck } from "lucide-react";
import Link from "next/link";
import useGeneralUserStore from "@/store/generalUserStore";

export function ProfileSection() {
  const user = useGeneralUserStore(s => s.userProfile);
  return (
    <section className={cn(
      "font-sketch py-2",
      user && !user?.emailVerified && "cursor-not-allowed pointer-events-none opacity-50"
    )}>
      <h2 className="text-sketch-fg font-sketchHeading text-xl mb-3 ml-2">Perfil</h2>
      <div className="bg-sketch-white border-[3px] border-sketch-border rounded-sketch-card shadow-sketch rotate-1 divide-y divide-dashed divide-sketch-fg/20 overflow-hidden">
        <Link
          href={APP_ROUTES.private.settings.perfil.name}
          className="w-full flex items-center justify-between p-4 hover:bg-sketch-accent-lt transition-colors"
        >
          <div className="flex items-center gap-3 text-sketch-fg">
            <Pencil size={20} strokeWidth={2.5} className="text-sketch-accent" />
            <span className="text-lg">Editar perfil</span>
          </div>
          <ChevronRight size={20} strokeWidth={2.5} className="text-sketch-fg/40" />
        </Link>
        <Link
          href={APP_ROUTES.private.settings.seguranca.name}
          className="w-full flex items-center justify-between p-4 hover:bg-sketch-accent-lt transition-colors"
        >
          <div className="flex items-center gap-3 text-sketch-fg">
            <ShieldCheck size={20} strokeWidth={2.5} className="text-sketch-accent" />
            <span className="text-lg">Segurança</span>
          </div>
          <ChevronRight size={20} strokeWidth={2.5} className="text-sketch-fg/40" />
        </Link>
      </div>
    </section>
  );
}

