"use client";
import Lottie from "lottie-react";
import shoppingCartWomanAnimation from "@/animations/shopping-cart-woman.json";
import { APP_ROUTES } from "@/routes/app-routes";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function StartPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col h-dvh page-wrapper sketch-shell mx-auto bg-sketch-bg gap-10 p-6 overflow-hidden font-sketch">
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        src="/images/test-logo-2.svg"
        className="w-[159px] h-[50px] rotate-[-2deg]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="flex items-center justify-center rounded-full border-4 border-sketch-fg bg-sketch-white shadow-sketch-lg size-[240px] mt-8 mx-auto overflow-hidden rotate-1"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Lottie
            className="size-[220px]"
            animationData={shoppingCartWomanAnimation}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="z-10"
      >
        <p className="text-center text-sketch-fg font-bold text-xl md:text-2xl leading-relaxed">
          Faça sua lista e organize suas compras de forma mais eficiente.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, type: "spring" }}
        className="w-full mt-auto"
      >
        <Button
          variant="default"
          size="lg"
          onClick={() => router.push(APP_ROUTES.public.login.name)}
          className="w-full h-12 text-xl uppercase tracking-wider"
        >
          <span>Começar Agora</span>
          <ArrowRightIcon size={24} strokeWidth={3} />
        </Button>
      </motion.div>
    </div>
  );
}
