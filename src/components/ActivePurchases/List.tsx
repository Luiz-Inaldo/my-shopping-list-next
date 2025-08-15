import { formatDate } from '@/functions/formatDate';
import { IPurchaseProps } from '@/types'
import React from 'react'
import { motion } from 'motion/react';
import { usePurchasesContext } from '@/context/PurchasesContext';
import { HomePagePurchaseSkeleton } from '../Skeletons/PurchaseListSkeletons';
import { DeletePurchase } from '../Forms/DeletePurchase';
import { APP_ROUTES } from '@/routes/app-routes';

export function ActivePurchsesList() {

    const { purchasesList, uiStates } = usePurchasesContext();

    if (uiStates.isLoading) return <HomePagePurchaseSkeleton />;

    return (
        <>
            {purchasesList.length > 0 ? (
                <>
                    {purchasesList.map((item: IPurchaseProps, index: number) => (
                        <motion.a
                            key={`compra-${item?.title}`}
                            href={APP_ROUTES.private.shoppingList.name(item.title)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.1 }}
                            className="w-full bg-app-container rounded-lg shadow flex flex-col gap-3 p-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-default-green" />
                                    <h3 className="text-subtitle font-semibold text-sm">{item.title}</h3>
                                </div>
                                <DeletePurchase purchase={item} />
                            </div>
                            <div className="flex text-xs items-center justify-between">
                                <p className='text-subtitle'>Iniciada em: {formatDate(item.start_date)}</p>
                                <p className='text-paragraph'>{item.items_count} {item.items_count === 1 ? 'item' : 'itens'}</p>
                            </div>
                        </motion.a>
                    ))}
                </>
            ) : (
                <p className="text-sm text-paragraph">Você não possui listas ativas</p>
            )}
        </>
    )
}
