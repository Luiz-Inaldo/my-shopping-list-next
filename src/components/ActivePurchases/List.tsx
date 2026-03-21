import { formatDate } from '@/functions/formatDate';
import { IPurchaseProps } from '@/types';
import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { usePurchasesContext } from '@/context/PurchasesContext';
import { HomePagePurchaseSkeleton } from '../Skeletons/PurchaseListSkeletons';
import { DeletePurchase } from '../Forms/DeletePurchase';
import { APP_ROUTES } from '@/routes/app-routes';
import Link from 'next/link';
import { Eye, Loader } from 'lucide-react';
import ErrorFetchData from '../Errors/ErrorFetchData';
import { cn } from '@/lib/utils';
import { Pin } from '../Pin';

function getListProgress(item: IPurchaseProps) {
  const items = item.purchase_items ?? [];
  const total = items.length;
  const checked = items.filter((i) => i.checked).length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  return { total, checked, pct };
}

export function ActivePurchsesList() {
  const {
    purchasesList,
    loadingPurchasesList,
    fetchingPurchasesList,
    pendingPurchasesList,
    errorFetchingPurchases,
  } = usePurchasesContext();

  const activeCount = purchasesList?.length ?? 0;

  if (loadingPurchasesList || pendingPurchasesList) {
    return <HomePagePurchaseSkeleton />;
  }

  if (errorFetchingPurchases) return <ErrorFetchData />;

  return (
    <>
      <div className="relative flex items-start justify-between gap-2">
        <span
          className={cn(
            'mb-1 inline-flex items-center gap-1.5 rounded-sketch-section-label border-2 border-sketch-border bg-sketch-yellow px-3 py-1 pl-2 font-sketch text-[13px] text-title shadow-sketch-2',
            '-rotate-1',
          )}
        >
          Listas ativas ({activeCount})
        </span>
        <Pin className="absolute -left-2 -top-4 -rotate-12" />
        {fetchingPurchasesList && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Loader size={14} className="animate-spin text-sketch-fg" />
              <p className="font-sketch text-xs text-paragraph">Atualizando...</p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {purchasesList && purchasesList.length > 0 ? (
          purchasesList.map((item: IPurchaseProps, index: number) => {
            const { total, checked, pct } = getListProgress(item);
            const isFull = pct === 100 && total > 0;
            const isEven = index % 2 === 0;
            const restRotate = isEven ? -0.3 : 0.4;

            return (
              <motion.div
                key={`compra-${item?.id ?? item?.title}`}
                initial={{ opacity: 0, y: 20, rotate: restRotate }}
                animate={{ opacity: 1, y: 0, rotate: restRotate }}
                whileHover={{ rotate: 0, skewX: 0, y: -2 }}
                transition={{ duration: 0.2, delay: index * 0.08 }}
                className="relative z-0 w-full rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-4 shadow-sketch hover:z-[1] hover:shadow-sketch-lg"
              >
                <div
                  className="pointer-events-none absolute -top-2.5 left-1/2 h-[18px] w-14 -translate-x-1/2 -rotate-2 border-x border-[rgba(108,71,201,0.2)] bg-[rgba(200,195,230,0.55)]"
                  aria-hidden
                />

                <div className="mb-2.5 flex items-start justify-between gap-2">
                  <h3 className="font-sketchHeading max-w-[200px] text-xl font-bold leading-tight text-title">
                    {item.title}
                  </h3>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-1.5 font-sketch text-[13px] text-title">
                  <span>
                    {total} {total === 1 ? 'item' : 'itens'}
                  </span>
                  <span
                    className="size-1 rounded-full bg-sketch-fg opacity-40"
                    aria-hidden
                  />
                  <span
                    className={cn(
                      'font-bold',
                      isFull ? 'text-sketch-success' : 'text-sketch-accent',
                    )}
                  >
                    {pct}% concluído
                  </span>
                </div>

                <div className="mb-3.5">
                  <div className="mb-1 flex justify-between font-sketch text-xs font-bold text-title opacity-60">
                    <span>
                      {checked} de {total} marcados
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div
                    className="relative h-2.5 w-full overflow-hidden rounded-sketch-progress border-2 border-sketch-border bg-sketch-muted"
                  >
                    <div
                      className={cn(
                        'h-full rounded-sketch-progress transition-[width] duration-300',
                        isFull ? 'bg-sketch-success' : 'bg-sketch-accent',
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    href={APP_ROUTES.private.shoppingList.name(item.id as string)}
                    className={cn("flex h-12 min-h-12 flex-1 items-center justify-center gap-2 rounded-sketch-btn border-2 border-sketch-border bg-sketch-accent font-sketch text-[15px] text-white shadow-sketch-sm transition-[transform,box-shadow,background-color] duration-100 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-sketch-accent-dk hover:shadow-sketch-2 active:translate-x-1 active:translate-y-1 active:shadow-none",
                      pct === 100 ? 'bg-sketch-success hover:bg-sketch-success-dk' : 'bg-sketch-accent',
                    )}
                  >
                    <Eye size={16} strokeWidth={2.5} />
                    Ver lista
                  </Link>
                  <DeletePurchase purchase={item} />
                </div>

                <p className="mt-3 font-sketch text-xs text-subtitle">
                  Iniciada em: {formatDate(item.start_date)}
                </p>
              </motion.div>
            );
          })
        ) : (
          <p className="font-sketch text-center text-sm text-paragraph opacity-80">
            Você não possui listas ativas
          </p>
        )}
      </div>
    </>
  );
}
