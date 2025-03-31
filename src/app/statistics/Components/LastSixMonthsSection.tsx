import { AnnualStatisticsChart } from '@/components/Charts/AnnualStatisticsChart';
import { YEARS } from '@/constants/years';
import { PurchasesContext } from '@/context/PurchasesContext';
import { IPurchaseProps } from '@/types';
import { AnnualFilterProps } from '@/types/charts';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

export const LastSixMonthsSection = () => {

    const { purchasesList } = useContext(PurchasesContext);
    
    const [data, setData] = useState<IPurchaseProps[]>([]);

    const filterLock = useRef(true);

    // functions
    const filterLastSixMonthsPurchases = useCallback(async () => {

        // TODO: ajustar lógica aqui.

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchasesList])

    useEffect(() => {
        if (!filterLock.current) {
            filterLastSixMonthsPurchases();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterLock.current]);

    useEffect(() => {
        if (purchasesList.length > 0 && filterLock.current) {
            filterLock.current = false;
        }
    }, [purchasesList]);

    return (
        <section className="grid gap-5">
            <div>
                <p className="text-paragraphdark font-bold mb-3">Resumo dos últimos 6 meses:</p>
                
            </div>
            {/* <AnnualStatisticsChart
                title={filterStates.dataType === 'percentual' ? 'Resumo por Categoria (%)' : 'Resumo por Categoria (R$)'}
                dataType={filterStates.dataType}
                data={filterLock.current ? [] : data}
            /> */}
        </section>
    )
}
