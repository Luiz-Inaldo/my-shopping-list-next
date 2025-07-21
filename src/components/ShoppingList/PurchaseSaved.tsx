"use client";
import { usePageOverlay } from "@/context/PageOverlayContext";
import { APP_ROUTES } from "@/routes/app-routes";
import Image from "next/image";
import Link from "next/link";

export default function PurchaseSaved({ close }: { close: () => void }) {

    const { handleChangeRoute } = usePageOverlay();

    return (
        <div className="absolute z-[20] inset-0 flex flex-col items-center p-10 w-[430px] mx-auto bg-app-background">
            <Image
                src="/images/celebration.svg"
                alt="pessoas comemorando"
                width={250}
                height={250}
            />
            <h1 className="text-subtitle text-lg text-center font-semibold my-4">Sua compra foi salva com sucesso.</h1>
            <p className="text-sm text-paragraph text-center">Consulte-a em sua área de históricos para mais detalhes</p>
            <div className="flex flex-col gap-1 mt-8">
                <Link
                    href="#"
                    className='mb-2 bg-default-green rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-snow text-sm uppercase'
                    onClick={(e) => {
                        e.preventDefault()
                        handleChangeRoute(APP_ROUTES.private.historic.name)
                    }}
                >
                    <span>ir para histórico</span>
                </Link>
                <Link
                    href="#"
                    className="px-3 py-2 flex items-center justify-center cursor-pointer uppercase text-sm text-subtitle"
                    onClick={(e) => {
                        e.preventDefault()
                        close();
                    }}
                >
                    <span className="underline">ir para página principal</span>
                </Link>
            </div>
        </div>
    )
}
