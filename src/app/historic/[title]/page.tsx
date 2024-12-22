"use client";
import { supabase } from '@/lib/api';
import { IPurchaseProps } from '@/types';
import { ChevronLeft, UtensilsCrossed } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LoggedLayout from '@/components/layout/MainLayout';
import Header from '@/components/Header';
import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app-routes';
import { CATEGORIES } from '@/constants/constants';
import { calculatePercentage } from '@/functions/categoryPercentage';

export default function HistoricPage() {
    const params = useParams();
    const { title } = params;
    const decodedTitle = decodeURIComponent(title as string);

    const [purchase, setPurchase] = useState<IPurchaseProps>({
        id: "",
        title: "",
        purchase_date: "",
        purchase_items: "",
        total_price: "",
        user_id: "",
    })

    //chamada para a api do supabase
    useEffect(() => {
        const fetchPurchase = async () => {
            const { data, error } = await supabase.from("purchases").select("*").eq("title", decodedTitle).single();
            if (error) {
                console.error(error);
            } else {
                setPurchase(data);
            }
        }
        fetchPurchase();
    }, []);

    useEffect(() => {
        if (purchase.purchase_items.length > 0) {
            setPurchase(old => {
                return {
                    ...old,
                    purchase_items: typeof old.purchase_items === 'string' ? JSON.parse(old.purchase_items) : old.purchase_items
                }
            })
        }
    }, [purchase.purchase_items])

    return (
        <>
            <LoggedLayout>
                <Header
                    content={(_: any) => (
                        <div className='flex gap-3 items-center'>
                            <Link href={APP_ROUTES.private.historic.name}>
                                <ChevronLeft
                                    size={20}
                                    className='text-titledark'
                                />
                            </Link>
                            <h1 className='text-lg font-semibold max-w-[370px] text-titledark text-ellipsis overflow-hidden whitespace-nowrap'>
                                Visualização de Histórico
                            </h1>
                        </div>
                    )}
                />

                <div className='w-full px-5 py-[100px]'>
                    <div className='flex flex-col gap-10'>
                        <h2 className='text-lg text-subtitledark font-semibold'>{decodedTitle}</h2>
                        <div className='flex flex-col gap-5'>
                            <div className='grid gap-2'>
                                <h3 className='text-subtitledark'>Informações Gerais</h3>
                                <div className='bg-secondary-dark/80 p-3 rounded-md'>
                                    <div className="flex items-center gap-1">
                                        <p className='text-paragraphdark'>Valor Total:</p>
                                        <p className='text-paragraphdark font-semibold'>{purchase.total_price}</p>
                                    </div>
                                    <div className="flex items-center gap-1 mb-5">
                                        <p className='text-paragraphdark'>Data da compra:</p>
                                        <p className='text-paragraphdark font-semibold'> {purchase.purchase_date.split("T")[0].split("-").reverse().join("/")}</p>
                                    </div>

                                    <Link
                                        href={APP_ROUTES.private.historic.details.children(decodedTitle)}
                                        className='py-2 px-4 bg-secondary-blue text-linkdark flex items-center justify-center rounded-md w-full'>
                                        GERAR CUPOM
                                    </Link>
                                </div>
                            </div>
                            <div className='grid gap-2'>
                                <h3 className='text-subtitledark'>Estatísticas da compra</h3>
                                <div className='bg-secondary-dark/80 p-3 rounded-md grid gap-4'>
                                    {CATEGORIES.map((category) => (
                                        <div key={category.name} className='flex items-center gap-2'>
                                            <category.icon strokeWidth={1.5} size={18} className='shrink-0 text-paragraphdark' />
                                            <p className='shrink-0 text-paragraphdark'>{category.name}</p>
                                            <span
                                                style={{
                                                    backgroundColor: category.color,
                                                    width: calculatePercentage(purchase.purchase_items, category.name),
                                                }}
                                                className='h-4 rounded-md'
                                            />
                                            <p className='shrink-0 text-paragraphdark'>{calculatePercentage(purchase.purchase_items, category.name)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LoggedLayout>
        </>
    );
};