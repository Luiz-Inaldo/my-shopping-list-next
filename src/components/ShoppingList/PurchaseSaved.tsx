"use client";
import { usePageOverlay } from "@/context/PageOverlayContext";
import { APP_ROUTES } from "@/routes/app-routes";
import { History, House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import useGeneralUserStore from "@/store/generalUserStore";
import { useQueryClient } from "@tanstack/react-query";
import { useShoplistContext } from "@/context/ShoplistContext";
import { QUERY_KEYS } from "@/constants/queryKeys";

export default function PurchaseSaved() {

    const userId = useGeneralUserStore(s => s.userProfile?.uid)
    const { listName } = useShoplistContext();
    const { handleChangeRoute } = usePageOverlay();

    const queryClient = useQueryClient();

    function handleGoToHome(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        handleChangeRoute(APP_ROUTES.private.home.name);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.activePurchases, userId, listName] })
    }

    return (
        <div className="flex flex-col items-center justify-between p-10 w-full h-svh mx-auto bg-app-background">
            <div>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="w-[200px] h-[200px] mx-auto rounded-full"
                >
                    <Image
                        src="/images/big-check.svg"
                        alt="pessoas comemorando"
                        width={200}
                        height={200}
                    />
                </motion.div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-subtitle text-center text-lg font-semibold mt-4 mb-2"
                >
                    Sua compra foi salva com sucesso.
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base text-paragraph text-center max-w-[300px] leading-tight"
                >
                    Você pode conferir os detalhes da compra
                    na área de histórico
                </motion.p>
            </div>
            <motion.div
                className="w-full flex flex-col gap-3 mt-8"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Link
                    href="#"
                    className='w-full bg-default-green rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer transition-all duration-300 ease-in-out text-snow text-sm uppercase'
                    onClick={(e) => {
                        e.preventDefault()
                        handleChangeRoute(APP_ROUTES.private.historic.name)
                    }}
                >
                    <History size={16} />
                    <span>Ir para Histórico</span>
                </Link>
                <Link
                    href="#"
                    className="w-full border border-default-green rounded-full px-3 py-2 flex gap-2 items-center justify-center cursor-pointer transition-all duration-300 ease-in-out text-default-green text-sm "
                    onClick={handleGoToHome}
                >
                    <House size={16} />
                    <span>Voltar para Home</span>
                </Link>
            </motion.div>
        </div>
    )
}
