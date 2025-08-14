import { formatDate } from '@/functions/formatDate';
import { IPurchaseProps } from '@/types'
import React from 'react'
import { motion } from 'motion/react';
import { usePurchasesContext } from '@/context/PurchasesContext';
import { Trash2 } from 'lucide-react';
import { HomePagePurchaseSkeleton } from '../Skeletons/PurchaseListSkeletons';
import { DeletePurchase } from '../Forms/DeletePurchase';

export function ActivePurchsesList() {

    const { purchasesList, uiStates } = usePurchasesContext();

    if (uiStates.isLoading) return <HomePagePurchaseSkeleton />;

    return (
        <>
            {purchasesList.length > 0 ? (
                <>
                    {purchasesList.map((item: IPurchaseProps, index: number) => (
                        <motion.div
                            key={`compra-${item?.title}`}
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
                        </motion.div>
                    ))}
                </>
            ) : (
                <p className="text-sm text-paragraph">Você não possui listas ativas</p>
            )}
        </>
    )
}
