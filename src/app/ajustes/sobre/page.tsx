import Header from "@/components/Header";
import { APP_ROUTES } from "@/routes/app-routes";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Header className="text-lg font-medium">
        <Link href={APP_ROUTES.private.settings.name} className="flex items-center gap-1 text-subtitle">
          <ChevronLeft size={20} />
        </Link>
        <span>Sobre o aplicativo</span>
      </Header>

      <main className="main-container px-5 pb-6 pt-6 flex flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-center flex-1 gap-2">
          <Image
            src="/images/test-logo-2.svg"
            alt="EzShoplist"
            width={218}
            height={50}
            className="w-[218px] h-[50px]"
          />
          <span className="text-gray-400 text-sm">Versão 1.0.0</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-paragraph text-sm">
            Desenvolvido com <span className="text-red-500">❤️</span> para facilitar suas compras
          </p>
          <p className="text-gray-400 text-xs">© 2025 EzShoplist</p>
        </div>
      </main>
    </>
  );
}

