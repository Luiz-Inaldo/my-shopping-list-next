import { formatDate } from '@/functions/formatDate';
import { IPurchaseProps } from '@/types'
import React from 'react'
import { motion } from 'motion/react';
import { usePurchasesContext } from '@/context/PurchasesContext';
import { HomePagePurchaseSkeleton } from '../Skeletons/PurchaseListSkeletons';
import { DeletePurchase } from '../Forms/DeletePurchase';
import { APP_ROUTES } from '@/routes/app-routes';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useGeneralUserStore from '@/store/generalUserStore';
import { getActivePurchaseList } from '@/services/purchasesListServices';
import ErrorFetchData from '../Errors/ErrorFetchData';

export function ActivePurchsesList() {

    const userId = useGeneralUserStore(store => store.userProfile?.uid);

    const { purchasesList, loadingPurchasesList, fetchingPurchasesList, pendingPurchasesList, errorFetchingPurchases } = usePurchasesContext();

    // if (uiStates.isLoading) return <HomePagePurchaseSkeleton />;

    if (loadingPurchasesList || pendingPurchasesList) return <HomePagePurchaseSkeleton />;

    if (fetchingPurchasesList) return <p className="text-sm text-paragraph">Atualizando lista...</p>

    if (errorFetchingPurchases) return <ErrorFetchData />;

    return (
        <>
            <h2 className="text-subtitle font-medium">Suas listas ativas</h2>

            <div className="flex flex-col gap-3 items-center">
                {purchasesList && purchasesList?.length > 0 ? (
                    <>
                        {purchasesList?.map((item: IPurchaseProps, index: number) => (
                            <motion.div
                                key={`compra-${item?.title}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.1 }}
                                className="w-full bg-app-container rounded-lg shadow flex gap-3 items-center p-3"
                            >
                                <div className="flex flex-1 flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-default-green" />
                                            <h3 className="text-subtitle font-semibold text-sm">{item.title}</h3>
                                            <p className='text-sm text-paragraph'>({item.items_count} {item.items_count === 1 ? 'item' : 'itens'})</p>
                                        </div>
                                    </div>
                                    <div className="flex text-xs items-center justify-between">
                                        <p className='text-subtitle'>Iniciada em: {formatDate(item.start_date)}</p>
                                    </div>
                                </div>
                                <div
                                    className='flex items-center justify-center gap-2 pl-3 border-l border-app-border'
                                >
                                    <DeletePurchase purchase={item} />
                                    <Link
                                        href={APP_ROUTES.private.shoppingList.name(item.title)}
                                        className="flex items-center justify-center size-8 rounded-full bg-default-green text-snow">
                                        <ChevronRight size={18} className='mx-auto' />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </>
                ) : (
                    <p className="text-sm text-paragraph">Você não possui listas ativas</p>
                )}
            </div>
        </>
    )
}
