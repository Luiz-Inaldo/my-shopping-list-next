"use client";
import React, { useEffect, useState } from 'react'
import { MainHeader } from '../Header/MainHeader'
import { supabase } from '@/lib/api';
import useGeneralUserStore from '@/store/generalUserStore';
import NewListForm from '../Forms/NewListForm';
import { IPurchaseProps } from '@/types';
import { ActivePurchsesList } from '../ActivePurchases/List';

export const HomePage = () => {

    const user = useGeneralUserStore(store => store.user);

    const [data, setData] = useState<IPurchaseProps[] | null>(null);

    useEffect(() => {
        async function getData() {
            if (user === null) return;
            const { data, error } = await supabase.from('purchases').select('title, items_count, purchase_date').eq('user_id', user?.id).eq('is_active', true);
            setData(data as unknown as IPurchaseProps[]);
        }
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="w-full h-36 bg-gradient-to-r from-[#011c01] to-[#165518]">
                <MainHeader />
            </div>
            <div className="container">
                <div className='absolute w-[calc(100%-32px)] -top-[60px] min-h-[100px] flex items-center justify-center p-4 bg-blue-100 rounded-lg shadow-sm'>
                    <p className="text-sm text-subtitle">Não há conteudo disponível para exibir</p>
                </div>

                <h2 className="text-subtitle mt-[60px] font-medium">Suas listas ativas</h2>

                <ActivePurchsesList data={data} />
                <NewListForm />
            </div>
        </>
    )
}
