import { CATEGORIES } from '@/constants/categories';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useShoplistContext } from '@/context/ShoplistContext';
import { cn } from '@/lib/utils';
import { IPurchaseProps } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
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
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 border-2 px-3 py-2 font-sketch text-[13px] shadow-sketch-sm transition-[transform,box-shadow] duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none rounded-sketch-notif',
                  filterValue === category.name
                    ? 'border-sketch-accent bg-sketch-accent-lt text-sketch-accent-dk shadow-sketch-nav'
                    : 'border-sketch-border bg-sketch-white text-title shadow-sketch-sm hover:-rotate-1'
                )}
              >
                <p className="whitespace-nowrap font-bold">{category.name}</p>
                <span
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-sketch-section-label border-2 border-sketch-border font-sketch text-[11px] font-bold',
                    filterValue === category.name
                      ? 'bg-sketch-accent text-sketch-white'
                      : 'bg-sketch-muted text-sketch-fg'
                  )}
                >
                  {totalItemsOnCurrentCategory}
                </span>
              </div>
            );
          })}
        </>
      </div>
      <AnimatePresence>
        {filterValue && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: -10, opacity: 0, transition: { duration: 0.2 } }}
            className="flex items-center justify-between gap-2 border-2 border-sketch-success/50 bg-sketch-success/15 px-3 py-2 rounded-sketch-notif"
          >
            <div className="flex items-center gap-2 font-sketch text-sketch-success-dk">
              <Filter size={14} strokeWidth={2.5} />
              <p className="text-[13px] font-bold">Filtro ativo</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFilter}
              className="rounded-sketch-btn border-2 border-sketch-border bg-sketch-white px-3 py-1.5 font-sketch text-xs font-bold text-title shadow-sketch-sm transition-[transform,box-shadow] duration-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Limpar filtro
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
