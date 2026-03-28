'use client';

import { APP_ROUTES } from '@/routes/app-routes';
import { History, House } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { LottieAnimation } from '../Lottie/LottieAnimation';
import celebrateAnimation from '@/animations/celebrate.json';
import { useEffect, useState } from 'react';

export default function PurchaseSaved() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 1_500);
  }, []);

  return (
    <div className="sketch-shell relative mx-auto flex min-h-screen-dvh w-full flex-col overflow-hidden">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: '-50%', y: '-260px' }}
          animate={{ opacity: 1, x: '-50%', y: '-260px' }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="absolute bottom-0 left-1/2 h-[500px] w-[500px]"
        >
          <LottieAnimation
            animationData={celebrateAnimation}
            width={500}
            height={500}
          />
        </motion.div>
      )}

      <motion.div
        className="absolute -bottom-10 -left-[5%] z-[2] flex h-96 w-[110%] flex-col items-center justify-between rounded-sketch-footer-top border-t-2 border-sketch-border bg-sketch-accent p-14 shadow-sketch"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="font-sketchHeading my-4 text-center text-xl font-bold text-sketch-white"
          >
            Compra salva com sucesso!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center font-sketch text-base leading-tight text-sketch-white/80"
          >
            Você pode conferir os detalhes da compra na área de histórico
          </motion.p>
        </div>
        <motion.div
          className="flex w-full flex-col gap-3"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Link
            href={APP_ROUTES.private.historic.name}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-sketch-btn border-2 border-sketch-border bg-sketch-white px-4 py-2 font-sketch text-sm font-bold uppercase text-sketch-accent shadow-sketch-sm transition-[transform,box-shadow] duration-100 hover:-rotate-1 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-sketch active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <History size={16} strokeWidth={2.5} />
            <span>Ir para Histórico</span>
          </Link>
          <Link
            href={APP_ROUTES.private.home.name}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-sketch-btn border-2 border-sketch-white bg-transparent px-4 py-2 font-sketch text-sm font-bold text-sketch-white shadow-sketch-sm transition-[transform,box-shadow] duration-100 hover:-rotate-1 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-sketch active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <House size={16} strokeWidth={2.5} />
            <span>Voltar para Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
