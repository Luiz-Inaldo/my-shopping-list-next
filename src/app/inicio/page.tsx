"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import shoppingCartWomanAnimation from "@/animations/shopping-cart-woman.json";
import { APP_ROUTES } from "@/routes/app-routes";
import { ArrowRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "@/components/AnimatedLogo/AnimatedLogo";

export default function StartPage() {
  const router = useRouter();
  const [isLottieAnimationLoaded, setIsLottieAnimationLoaded] = useState(false);
  const [isObservationEnabled, setIsObservationEnabled] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    const observationDelay = setTimeout(() => {
      setIsObservationEnabled(true);
    }, 6_200);

    return () => {
      clearTimeout(observationDelay);
    };
  }, []);

  useEffect(() => {
    if (!isObservationEnabled || showMainContent) {
      return;
    }

    const lottieLoadCheck = setInterval(() => {
      if (isLottieAnimationLoaded) {
        clearInterval(lottieLoadCheck);
        setShowMainContent(true);
      }
    }, 2000);

    return () => {
      clearInterval(lottieLoadCheck);
    };
  }, [isLottieAnimationLoaded, isObservationEnabled, showMainContent]);

  return (
    <div className="relative h-dvh overflow-hidden bg-sketch-bg font-sketch">
      <motion.main
        initial={false}
        animate={{ opacity: showMainContent ? 1 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="page-wrapper sketch-shell mx-auto flex h-full flex-col gap-10 overflow-hidden p-6"
      >
        {/* <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          src="/images/new-logo.svg"
          className="w-[159px] h-[50px] rotate-[-2deg]"
        /> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="flex items-center justify-center rounded-full border-4 border-sketch-fg bg-sketch-white shadow-sketch-lg size-[240px] mt-auto mx-auto overflow-hidden rotate-1"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Lottie
              className="size-[220px]"
              animationData={shoppingCartWomanAnimation}
              onDOMLoaded={() => setIsLottieAnimationLoaded(true)}
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
      </motion.main>

      <AnimatePresence mode="wait">
        {!showMainContent && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center bg-sketch-accent px-6"
          >
            <AnimatedLogo className="w-[280px] max-w-[80vw]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
