"use client";
import Header from '@/components/Header';
import LoggedLayout from '@/components/layout/MainLayout';
import { Modal } from '@/components/Modal';
import { MONTHS } from '@/constants/months';
import { YEARS } from '@/constants/years';
import { ProductsContext } from '@/context/ProductsContext';
import { PurchasesContext } from '@/context/PurchasesContext';
import { formatCurrency } from '@/functions/formatCurrency';
import { APP_ROUTES } from '@/routes/app-routes';
import { IFilterProps, IPurchaseProps } from '@/types';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense, useCallback, useContext, useEffect, useState } from 'react';


export default function Historic() {

    const { setModal } = useContext(ProductsContext);
    const { purchasesList, purchasesLoading, filterPurchases } = useContext(PurchasesContext);
    const [purchase, setPurchase] = useState<IPurchaseProps>({
        id: "",
        title: "",
        purchase_date: "",
        purchase_items: "",
        total_price: "",
        user_id: "",
    });
    const [filterStates, setFilterStates] = useState<IFilterProps>({
        month: "todos",
        year: "todos",
    });

    const handleOpenModal = useCallback((purchase: IPurchaseProps) => {
        setModal({
            state: "OPEN",
            type: "DELETE_PURCHASE"
        });
        setPurchase(purchase);
    }, [setModal])

    const handleFilterPurchases = (e: React.ChangeEvent<HTMLSelectElement>, type: string) => {

        if (e.target.value === "todos") {
            setFilterStates((prev) => ({ ...prev, [type]: e.target.value }));
        } else {
            setFilterStates(prev => ({
                ...prev,
                [type]: parseInt(e.target.value)
            }));
        }

    };

    useEffect(() => {
        filterPurchases(filterStates);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStates]);

    return (
        <LoggedLayout>
            <Header
                content={(_) => (
                    <h1 className='text-lg font-semibold max-w-[370px] text-titledark text-ellipsis overflow-hidden whitespace-nowrap'>
                        Histórico de Compras
                    </h1>
                )}
            />
            <div className='w-full px-5 py-[100px]'>

                <div className='grid 2xsm:grid-cols-1 gap-4'>

                    <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                        <p className='text-gray-500 font-semibold col-span-2 text-lg'>Filtrar por:</p>

                        <label className='relative flex-1 col-span-1'>
                            <span className='text-paragraphdark'>Mês</span>
                            <select
                                onChange={(e) => handleFilterPurchases(e, "month")}
                                className='w-full placeholder:text-paragraphdark text-paragraphdark bg-secondary-dark rounded-sm px-3 py-2'
                            >
                                <option value="todos">Todos os meses</option>
                                {MONTHS.map((month, index) => (
                                    <option key={month} value={index}>{month}</option>
                                ))}
                            </select>
                        </label>

                        <label className='relative flex-1 col-span-1'>
                            <span className='text-paragraphdark'>Ano</span>
                            <select
                                onChange={(e) => handleFilterPurchases(e, "year")}
                                className='w-full placeholder:text-paragraphdark text-paragraphdark bg-secondary-dark rounded-sm px-3 py-2'
                            >
                                <option value="todos">Todos os anos</option>
                                {YEARS.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <hr className='border-gray-600 mb-5' />

                    {purchasesLoading ? (
                        <p className='text-center text-paragraphdark'>carregando histórico...</p>
                    ) : (
                        <>
                            {purchasesList?.length === 0 ? (
                                <div className='flex flex-col items-center gap-3 mt-10'>
                                    <Image
                                        src={'/images/feeling_blue.svg'}
                                        alt="rostinho triste com mulher ao lado"
                                        width={200}
                                        height={150}
                                    />
                                    <p className='text-center text-paragraphdark'>você não possui compras registradas</p>
                                </div>
                            ) : (
                                <React.Fragment>
                                    {purchasesList?.map((purchase) => (
                                        <div
                                            key={purchase.id}
                                            className='bg-secondary-dark/80 border border-gray-600 rounded shadow-md p-2 flex flex-col gap-3'
                                        >
                                            <div className='flex items-center gap-2'>
                                                <div className='flex items-center gap-2 flex-1'>
                                                    <div className='rounded-full bg-dark-button-color w-2 h-2'></div>
                                                    <h2 className='font-bold text-subtitledark'>
                                                        {purchase.title}
                                                    </h2>
                                                </div>
                                                <div className='flex items-center justify-center cursor-pointer text-paragraphdark'>
                                                    <Trash2
                                                        onClick={() => handleOpenModal(purchase)}
                                                        size={16}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex flex-col gap-4'>
                                                <div className='flex items-center justify-between text-paragraphdark'>
                                                    <span>{formatCurrency(purchase.total_price)}</span>
                                                    <span>{purchase.purchase_date.split("T")[0].split("-").reverse().join("/")}</span>
                                                </div>
                                                <div>
                                                    <Link
                                                        href={APP_ROUTES.private.historic.details.name(purchase.title)}
                                                        className='flex items-center gap-1 font-medium text-sm text-paragraphdark'
                                                    >
                                                        ver detalhes
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
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