"use client"
import Image from "next/image";

export default function DeviceErrorPage() {
    return (
        <div className="bg-primary-dark grid h-screen w-full place-items-center justify-center">
            <div className="grid w-full p-5 place-items-center">
                <Image
                    src={"/images/mobile-content.svg"}
                    alt="duas pessoas olhando para um celular"
                    width={180}
                    height={200}
                    className="mb-10"
                />
                <h1 className="text-titledark text-3xl mb-5 font-semibold">Oopa!</h1>
                <p className="text-paragraphdark text-center">Infelizmente, essa aplicação só se encontra disponível para celulares =/ .</p>
            </div>
        </div>
    )
}
