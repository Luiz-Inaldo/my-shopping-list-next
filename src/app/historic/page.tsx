"use client";
import LoggedLayout from '@/components/layout/LoggedLayout';
import { Modal } from '@/components/Modal';
import { toast } from '@/components/ui/use-toast';
import { ProductsContext } from '@/context/ProductsContext';
import { PurchasesContext } from '@/context/PurchasesContext';
import { formatCurrency } from '@/functions/formatCurrency';
import { supabase } from '@/lib/api';
import { APP_ROUTES } from '@/routes/app-routes';
import { IPurchaseProps } from '@/types';
import { ToastAction } from '@radix-ui/react-toast';
import { ArrowRight, Router, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { Suspense, useContext, useEffect, useState } from 'react';

export default function Historic() {

    const { setModal } = useContext(ProductsContext);
    const { purchasesList, loading } = useContext(PurchasesContext);
    const router = useRouter();
    const [purchase, setPurchase] = useState<IPurchaseProps>({
        id: "",
        title: "",
        purchase_date: "",
        purchase_items: "",
        total_price: "",
        user_id: "",
    });

    function handleOpenModal(purchase: IPurchaseProps) {
        setModal({
            state: "OPEN",
            type: "DELETE_PURCHASE"
        });
        setPurchase(purchase);
    }

    return (
        <LoggedLayout>
            <div className='w-full px-5'>
                <h1 className='text-xl font-semibold mb-8 max-w-[370px] text-subtitle text-ellipsis overflow-hidden whitespace-nowrap'>
                    Histórico de Compras
                </h1>
                <div className='grid 2xsm:grid-cols-1 gap-4'>

                    {loading ? (
                        <p className='text-center'>carregando histórico...</p>
                    ) : (
                        <>
                            {purchasesList.length === 0 ? (
                                <div className='flex flex-col items-center gap-3'>
                                    <Image
                                        src={'/images/feeling_blue.svg'}
                                        alt="rostinho triste com mulher ao lado"
                                        width={200}
                                        height={150}
                                    />
                                    <p className='text-center'>você não possui compras registradas</p>
                                </div>
                            ) : (
                                purchasesList.map((purchase) => (
                                    <div
                                        key={purchase.id}
                                        className='bg-subtitle/15 border border-gray-100 rounded shadow-md p-2 flex flex-col gap-3'
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div className='flex items-center gap-2 flex-1'>
                                                <div className='rounded-full bg-subtitle w-2 h-2'></div>
                                                <h2 className='font-bold text-subtitle'>
                                                    {purchase.title}
                                                </h2>
                                            </div>
                                            <div className='flex items-center justify-center cursor-pointer'>
                                                <Trash2
                                                    onClick={() => handleOpenModal(purchase)}
                                                    size={16}
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex items-center justify-between'>
                                                <span>{formatCurrency(purchase.total_price)}</span>
                                                <span>{purchase.purchase_date.split(",")[0]}</span>
                                            </div>
                                            <div>
                                                <p
                                                    onClick={() => router.push(APP_ROUTES.private.historic.children.name(purchase.title))}
                                                    className='flex items-center gap-1 font-medium text-blue-900 hover:text-blue-700 transition-colors duration-300'
                                                >
                                                    <ArrowRight size={16} />
                                                    clique para detalhes
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                </div>
            </div>
            <Suspense fallback={null}>
                <Modal item={purchase} />
            </Suspense>
        </LoggedLayout>
    )
}