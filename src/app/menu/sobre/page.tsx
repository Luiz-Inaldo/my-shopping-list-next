import Header from "@/components/Header";
import { APP_ROUTES } from "@/routes/app-routes";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="sketch-shell min-h-screen flex flex-col">
      <Header className="text-2xl font-sketchHeading">
        <Link href={APP_ROUTES.private.menu.name} className="flex items-center gap-1 text-sketch-fg">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </Link>
        <span>Sobre o aplicativo</span>
      </Header>

      <main className="flex-1 px-5 pb-12 pt-12 flex flex-col items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center flex-1 gap-4">

          <Image
            src="/images/test-logo-2.svg"
            alt="EzShoplist"
            width={218}
            height={50}
            className="w-[218px] h-[50px]"
          />

          <span className="text-sketch-fg/60 font-sketch text-xl">Versão 1.0.0</span>
        </div>

        <div className="flex flex-col items-center gap-2 text-center font-sketch">
          <p className="text-sketch-fg text-lg leading-tight">
            Desenvolvido com ❤️ para facilitar suas compras
          </p>
          <p className="text-sketch-fg/40 text-base">© 2025 EzShoplist</p>
        </div>
      </main>
    </div>
  );
}

