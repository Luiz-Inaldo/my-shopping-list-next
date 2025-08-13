import { formatDate } from '@/functions/formatDate';
import { IPurchaseProps } from '@/types'
import React from 'react'
import { motion } from 'motion/react';

export function ActivePurchsesList({data}: {data: IPurchaseProps[] | null}) {

    if (!data) return <p>Carregando lista...</p>;

    return (
        <div className="flex flex-col gap-3 items-center">
            {data.length > 0 ? (
                <>
                    {data.map((item: any, index) => (
                        <motion.div 
                        key={`compra-${item?.title}`} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="w-full bg-app-container rounded-lg shadow-md flex flex-col gap-3 p-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-default-green" />
                                    <h3 className="text-subtitle font-semibold text-sm">{item.title}</h3>
                                </div>
                                <p className='text-sm text-paragraph'>{item.items_count} {item.items_count === 1 ? 'item' : 'itens'}</p>
                            </div>
                            <p className='text-sm text-subtitle'>Iniciada em: {formatDate(item.purchase_date)}</p>
                        </motion.div>
                    ))}
                </>
            ) : (
                <p className="text-sm text-paragraph">Você não possui listas ativas</p>
            )}
        </div>
    )
}
