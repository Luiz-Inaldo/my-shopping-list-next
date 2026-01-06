'use client';

import { APP_ROUTES } from '@/routes/app-routes';
import { History, House } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { LottieAnimation } from '../Lottie/LottieAnimation';
import celebrateAnimation from '@/animations/celebrate.json';
import { useEffect, useState } from 'react';

export default function PurchaseSaved() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 1_500);
  }, []);

  return (
    <div className="relative page-wrapper w-full h-screen overflow-hidden mx-auto bg-app-background">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: '-50%', y: '-260px' }}
          animate={{ opacity: 1, x: '-50%', y: '-260px' }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="absolute bottom-0 w-[500px] h-[500px] left-1/2 rounded-full"
        >
          <LottieAnimation
            animationData={celebrateAnimation}
            width={500}
            height={500}
          />
        </motion.div>
      )}

      {/* blue background */}
      <motion.div
        className="absolute flex flex-col p-14 -left-[5%] items-center justify-between z-[2] w-[110%] -bottom-10 h-96 rounded-tl-[85px] rounded-tr-[85px] bg-[linear-gradient(135deg,#161334_0%,#241F56_60%,#322B78_100%)]"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5}}
      >
        <div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-snow text-center text-xl font-semibold my-4"
          >
            Compra salva com sucesso!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-base text-[#b8bcc0] text-center max-w-[300px] leading-tight"
          >
            Você pode conferir os detalhes da compra na área de histórico
          </motion.p>
        </div>
        <motion.div
          className="w-full flex flex-col gap-3"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Link
            href={APP_ROUTES.private.historic.name}
            className="w-full h-10 bg-snow rounded-xl px-3 py-2 flex gap-2 items-center justify-center cursor-pointer transition-all duration-300 ease-in-out text-app-primary text-sm uppercase"
          >
            <History size={16} />
            <span>Ir para Histórico</span>
          </Link>
          <Link
            href={APP_ROUTES.private.home.name}
            className="w-full h-10 border border-snow rounded-xl px-3 py-2 flex gap-2 items-center justify-center cursor-pointer transition-all duration-300 ease-in-out text-snow text-sm "
          >
            <House size={16} />
            <span>Voltar para Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
