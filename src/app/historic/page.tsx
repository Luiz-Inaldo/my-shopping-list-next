"use client";
import LoggedLayout from '@/components/layout/LoggedLayout';
import { ProductsContext } from '@/context/ProductsContext';
import { supabase } from '@/lib/api';
import { APP_ROUTES } from '@/routes/app-routes';
import { IProductProps, IPurchaseProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

export default function Settings() {

    const { user } = useContext(ProductsContext);
    const [purchasesList, setPurchasesList] = useState<IPurchaseProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        const getPurchases = async () => {
            setLoading(true);
            const { data, error } = await supabase.from("purchases").select("*").eq("user_id", user.id)

            if (error) {
                console.error(error);
            } else {
                setPurchasesList(data as IPurchaseProps[]);
            }
            setLoading(false);
        }
        getPurchases();
    }, [])

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
                                    <Link
                                        href={APP_ROUTES.private.historic.children.name(purchase.title)}
                                        key={purchase.id}
                                        className='bg-subtitle/15 border border-gray-100 rounded shadow-md p-2 flex flex-col gap-5'
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div className='rounded-full bg-subtitle w-2 h-2'></div>
                                            <h2 className='font-bold text-subtitle'>{purchase.title}</h2>
                                        </div>
                                        <div className='flex items-center justify-between'>
                                            <span>R$: {purchase.total_price}</span>
                                            <span>{purchase.purchase_date.split(",")[0]}</span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </>
                    )}

                </div>
            </div>
        </LoggedLayout>
    )
}