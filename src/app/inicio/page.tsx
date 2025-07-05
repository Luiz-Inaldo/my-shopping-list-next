"use client";
import React from "react";
import Lottie from "lottie-react";
import shoppingCartWomanAnimation from "@/animations/shopping-cart-woman.json";
import { APP_ROUTES } from "@/routes/app-routes";
import { ArrowRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useChangeRoute from "@/hooks/useChangeRoute";

export default function StartPage() {
  
  const {isChangingRoute, handleChangeRoute} = useChangeRoute();

  return (
    <div className="relative flex flex-col h-dvh w-full bg-white gap-10 p-4 overflow-hidden">
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        src="/images/test-logo-2.svg"
        className="w-[159px] h-[50px]"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center rounded-full bg-default-green/5 size-[200px] mt-12 mx-auto overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, x: "-100%" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <Lottie
            className="size-[200px]"
            animationData={shoppingCartWomanAnimation}
          />
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="text-center text-[#333] font-semibold text-sm"
      >
        Faça sua lista e organize suas compras de forma mais eficiente.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="w-full mt-auto"
      >
        <button
          onClick={() => handleChangeRoute(APP_ROUTES.public.auth.name)}
          className="w-full h-10 px-3 py-2 flex items-center gap-2 justify-center cursor-pointer font-semibold uppercase text-sm bg-default-green rounded-full text-white"
        >
          <span>Começe Agora</span>
          <ArrowRightIcon size={18} />
        </button>
      </motion.div>

      {/* Overlay effect to change route */}
      <AnimatePresence>
        {isChangingRoute && (
          <motion.div
            initial={{ opacity: 1, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white z-[1]"
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
