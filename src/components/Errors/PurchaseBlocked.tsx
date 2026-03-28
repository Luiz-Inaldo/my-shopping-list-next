import { Check, Hand, House } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useShoplistContext } from '@/context/ShoplistContext'
import useGeneralUserStore from '@/store/generalUserStore';
import { Button } from '../ui/button';
import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app-routes';

export function PurchaseBlocked() {

  const { productsList } = useShoplistContext();
  const userProfile = useGeneralUserStore(store => store.userProfile);

  return (
    <div className="sketch-shell flex h-screen flex-col items-center justify-between p-6">
      <div className="flex flex-col gap-5 items-center justify-center flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        >
          <Image
            src='/images/error.svg'
            alt='Essa não!'
            width={150}
            height={150}
          />
        </motion.div>

        <motion.h2
          className="font-sketchHeading text-center text-lg font-bold text-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Não foi possível acessar a lista desejada
        </motion.h2>

        <div className="w-full flex flex-col gap-3">

          <motion.p
            className="font-sketch text-sm font-bold text-paragraph"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            Por que estou vendo isso?
          </motion.p>

          {!productsList?.is_active && productsList?.user_id === userProfile?.uid && (
            <motion.div
              className="flex gap-3 rounded-sketch-card border-2 border-sketch-success bg-sketch-success/10 p-3 shadow-sketch-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Check size={20} strokeWidth={2.5} className="shrink-0 text-sketch-success" />
              <div className="space-y-1">
                <h3 className="font-sketch text-sm font-bold text-sketch-success-dk">Lista já concluída</h3>
                <p className="font-sketch text-[13px] text-paragraph">Essa lista já foi finalizada e não está mais acessível.</p>
              </div>
            </motion.div>
          )}

          {productsList?.user_id !== userProfile?.uid && (
            <motion.div
              className="flex gap-3 rounded-sketch-card border-2 border-sketch-danger bg-sketch-danger-lt p-3 shadow-sketch-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Hand size={20} strokeWidth={2.5} className="shrink-0 text-sketch-danger" />
              <div className="space-y-1">
                <h3 className="font-sketch text-sm font-bold text-sketch-danger">Permissões não definidas</h3>
                <p className="font-sketch text-[13px] text-paragraph">Você não tem permissão para acessar essa lista.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className='w-full'
      >
        <Link href={APP_ROUTES.private.home.name}>
          <Button className="w-full" size="lg">
            <House size={16} strokeWidth={2.5} />
            Voltar para a home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
