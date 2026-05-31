'use client';

import { IPurchaseProps } from '@/types';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { usePurchasesContext } from '@/context/PurchasesContext';
import { HomePagePurchaseSkeleton } from '../Skeletons/PurchaseListSkeletons';
import { Loader } from 'lucide-react';
import ErrorFetchData from '../Errors/ErrorFetchData';
import { cn } from '@/lib/utils';
import { Pin } from '../Pin';
import {
  ActivePurchasesTab,
  ActivePurchasesTabs,
} from './ActivePurchasesTabs';
import { PurchaseListCard } from './PurchaseListCard';

export function ActivePurchsesList() {
  const [activeTab, setActiveTab] = useState<ActivePurchasesTab>('created');

  const {
    purchasesList,
    loadingPurchasesList,
    fetchingPurchasesList,
    pendingPurchasesList,
    errorFetchingPurchases,
    sharedPurchasesList,
    loadingSharedPurchasesList,
    fetchingSharedPurchasesList,
    pendingSharedPurchasesList,
    errorFetchingSharedPurchases,
  } = usePurchasesContext();

  const isCreatedTab = activeTab === 'created';

  const currentList = isCreatedTab ? purchasesList : sharedPurchasesList;
  const isLoading = isCreatedTab
    ? loadingPurchasesList || pendingPurchasesList
    : loadingSharedPurchasesList || pendingSharedPurchasesList;
  const isFetching = isCreatedTab
    ? fetchingPurchasesList
    : fetchingSharedPurchasesList;
  const hasError = isCreatedTab
    ? errorFetchingPurchases
    : errorFetchingSharedPurchases;

  const activeCount = currentList?.length ?? 0;
  const createdCount = purchasesList?.length ?? 0;
  const sharedCount = sharedPurchasesList?.length ?? 0;

  const initialLoading =
    (loadingPurchasesList || pendingPurchasesList) &&
    (loadingSharedPurchasesList || pendingSharedPurchasesList);

  if (initialLoading) {
    return <HomePagePurchaseSkeleton />;
  }

  if (hasError) return <ErrorFetchData />;

  const emptyMessage = isCreatedTab
    ? 'Você não possui listas ativas'
    : 'Nenhuma lista foi compartilhada com você';

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
        {isFetching && (
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

      <ActivePurchasesTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-4 flex flex-col gap-4">
        {isLoading ? (
          <HomePagePurchaseSkeleton />
        ) : currentList && currentList.length > 0 ? (
          currentList.map((item: IPurchaseProps, index: number) => (
            <PurchaseListCard
              key={`compra-${item?.id ?? item?.title}`}
              item={item}
              index={index}
              deleteMode={isCreatedTab ? 'delete' : 'unlink'}
            />
          ))
        ) : (
          <p className="font-sketch text-center text-sm text-paragraph opacity-80">
            {emptyMessage}
          </p>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {createdCount} listas criadas, {sharedCount} compartilhadas
      </p>
    </>
  );
}
