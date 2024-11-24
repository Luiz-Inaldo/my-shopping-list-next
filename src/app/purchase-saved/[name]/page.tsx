"use client";
import Image from "next/image";
import Link from "next/link";

export default function PurchaseSaved() {

    return (
        <div className="flex flex-col items-center p-10 w-[430px] mx-auto bg-secondary-dark min-h-dvh">
            <Image
                src="/images/well_done.svg"
                alt="pessoas comemorando"
                width={200}
                height={200}
            />
            <h1 className="text-subtitle text-xl text-center font-semibold my-4">Sua compra foi salva com sucesso.</h1>
            <p className="text-paragraph text-center">Consulte-a em sua área de históricos para mais detalhes</p>
            <div className="flex flex-col gap-1 mt-8">
                <Link
                    href="/historic"
                    // onClick={generatePDF}
                    className='mb-2 bg-secondary-blue rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out text-snow text-sm uppercase'>
                    <span>ir para histórico</span>
                </Link>
                <Link
                    href="/"
                    className="px-3 py-2 flex items-center justify-center cursor-pointer uppercase text-sm text-link"
                >
                    <span className="underline">ir para página principal</span>
                </Link>
            </div>
        </div>
    )
}
