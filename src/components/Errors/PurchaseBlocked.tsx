import { Check, Hand } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useShoplistContext } from '@/context/ShoplistContext'
import useGeneralUserStore from '@/store/generalUserStore';

export function PurchaseBlocked() {

  const { productsList } = useShoplistContext();
  const userProfile = useGeneralUserStore(store => store.userProfile);

  return (
    <div className='space-y-5 p-6 h-screen flex flex-col items-center justify-center'>
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
        className="font-semibold text-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        Não foi possível acessar a lista desejada
      </motion.h2>

      <div className="w-full flex flex-col gap-3">

        <motion.p
          className="text-sm text-paragraph"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          Por que estou vendo isso?
        </motion.p>

        {!productsList?.is_active && productsList?.user_id === userProfile?.uid && (
          <motion.div
            className="flex gap-3 bg-app-container p-3 rounded-lg shadow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Check size={20} className="text-default-green shrink-0" />
            <div className="space-y-1">
              <h3 className="font-medium text-sm">Lista já concluída</h3>
              <p className='text-paragraph text-sm'>Essa lista já foi finalizada e não está mais acessível.</p>
            </div>
          </motion.div>
        )}

        {productsList?.user_id !== userProfile?.uid && (
          <motion.div
            className="flex gap-3 bg-app-container p-3 rounded-lg shadow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Hand size={20} className="text-action shrink-0" />
            <div className="space-y-1">
              <h3 className="font-medium text-sm">Permissões não definidas</h3>
              <p className='text-paragraph text-sm'>Você não tem permissão para acessar essa lista.</p>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  )
}
