import React, { useMemo } from 'react'
import { Product } from './Product'
import { Check, Filter } from 'lucide-react';
import Image from 'next/image';
import { IProductProps } from '@/types';
import { useShoplistContext } from '@/context/ShoplistContext';
import { AnimatePresence, motion } from 'motion/react';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { queryClient } from '@/utils/queryClient';

export function ProductsList({ list }: { list: IProductProps[] | null | undefined }) {

  const { auxData, productsList, setFilterValue, filterValue } = useShoplistContext();

  const totalCheckedItems = list?.filter(product => product.checked === true).length;
  const totalListItems = list?.length ?? 0;

  function handleRemoveFilter() {
    setFilterValue(null);
    queryClient.setQueryData([QUERY_KEYS.productsList, productsList?.id], auxData)
  }

  const sortedList = useMemo(() => {
    return list?.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, [list]);

  if (!list || totalListItems === 0) return <EmptyProducsList />

  return (

    <div className='space-y-5 pb-10'>
      <div className="flex items-center justify-between">
        <h3 className="text-subtitle text-sm font-medium">Produtos</h3>
        {(totalCheckedItems === totalListItems) ? (
          <div className='flex items-center gap-2 text-xs text-green-600 dark:text-green-400'>
            <Check size={14} />
            Todos os itens marcados
          </div>
        ) : (
          <p className="text-paragraph text-xs">{totalCheckedItems}/{totalListItems} itens</p>
        )}
      </div>

      <AnimatePresence>
        {filterValue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: -10, opacity: 0, transition: { duration: 0.2 } }}
            className="flex items-center justify-between py-2 px-3 border border-orange-400 dark:border-orange-700 bg-orange-200 dark:bg-orange-950/60 rounded-lg"
          >
            <div className="flex items-center gap-2 text-orange-950">
              <Filter size={14} />
              <p className='text-sm'>Filtro ativo</p>
            </div>
            <button
              onClick={handleRemoveFilter}
              className="text-black bg-snow py-1.5 px-3 rounded-full text-xs"
            >
              Limpar filtro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {sortedList?.map((product) => (
          <Product
            key={product.name}
            item={product} />
        ))}
      </div>
    </div>
  )
}

function EmptyProducsList() {
  return (
    <div className='space-y-5 mx-auto'>
      <Image
        src="/images/fruits.svg"
        alt="imagem das frutas"
        width={64}
        height={64}
        className="opacity-50 mx-auto"
      />
      <p className="text-paragraph text-xs">Ainda não há itens na lista</p>
    </div>
  )
}
