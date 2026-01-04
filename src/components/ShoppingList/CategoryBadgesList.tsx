import { CATEGORIES } from '@/constants/categories';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useShoplistContext } from '@/context/ShoplistContext';
import { cn } from '@/lib/utils';
import { IPurchaseProps } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter } from 'lucide-react';

export function CategoryBadgesList() {
  const { auxData, productsList, filterValue, setFilterValue } =
    useShoplistContext();
  const queryClient = useQueryClient();

  function handleRemoveFilter() {
    setFilterValue(null);
    queryClient.setQueryData(
      [QUERY_KEYS.productsList, productsList?.id],
      auxData
    );
  }

  function handleFilterByCategory(category: string) {
    const filteredItems =
      auxData?.purchase_items?.filter((item) => item.category === category) ??
      [];
    setFilterValue(category);
    queryClient.setQueryData(
      [QUERY_KEYS.productsList, productsList?.id],
      (oldList: IPurchaseProps | undefined) => ({
        ...oldList!,
        purchase_items: filteredItems,
      })
    );
  }

  if (!auxData) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 pb-1 px-0.5 overflow-x-scroll scrollbar-hide">
        <>
          {CATEGORIES.map((category) => {
            const totalItemsOnCurrentCategory = auxData.purchase_items?.filter(
              (item) => item.category === category.name
            ).length;

            if (totalItemsOnCurrentCategory === 0) return null;

            return (
              <div
                onClick={() => handleFilterByCategory(category.name)}
                key={category.name}
                className={`flex items-center gap-3 px-3 py-2 border rounded-xl shadow ${filterValue === category.name ? 'bg-app-selected border-app-primary/10' : 'border-app-border bg-app-container'}`}
              >
                <p
                  className={`text-xs whitespace-nowrap ${filterValue === category.name ? 'text-app-primary font-medium' : 'text-subtitle'}`}
                >
                  {category.name}
                </p>
                <div
                  className={cn(
                    'size-6 p-2 flex items-center justify-center rounded-full text-snow',
                    filterValue === category.name
                      ? 'bg-snow text-app-primary'
                      : 'bg-app-primary text-snow'
                  )}
                >
                  <p className="text-xs">{totalItemsOnCurrentCategory}</p>
                </div>
              </div>
            );
          })}
        </>
      </div>
      <AnimatePresence>
        {filterValue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: -10, opacity: 0, transition: { duration: 0.2 } }}
            className="flex items-center justify-between py-2 px-3 border border-app-secondary/70 bg-app-secondary/20 rounded-xl"
          >
            <div className="flex items-center gap-2 text-cyan-950">
              <Filter size={14} />
              <p className="text-sm">Filtro ativo</p>
            </div>
            <button
              onClick={handleRemoveFilter}
              className="text-subtitle bg-snow py-1.5 px-3 rounded-lg text-xs"
            >
              Limpar filtro
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
