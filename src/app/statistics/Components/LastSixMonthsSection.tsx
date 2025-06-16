import { AnnualStatisticsChart } from '@/components/Charts/AnnualStatisticsChart';
import { LastSixMonthsChart } from '@/components/Charts/LastSixMonthsChart';
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
        let numberOfMonths = 6;
        const startMonth = new Date().getMonth() + 1;
        let lastMonth = startMonth;
        let year = new Date().getFullYear();

        while (numberOfMonths > 0) {
            lastMonth -= 1;
            if (lastMonth === 0) {
                lastMonth = 12;
                year -= 1;
            }
            numberOfMonths -= 1;
        }

        const filteredData = purchasesList.filter(purchase => 
            purchase.purchase_date.split("T")[0] >= `${year}-${String(lastMonth).padStart(2, '0')}-01` &&
            purchase.purchase_date.split("T")[0] <= `${String(new Date().getFullYear())}-${String(startMonth).padStart(2, '0')}-31` 
        ).sort((a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime())

        setData(filteredData);

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
            <p className="text-subtitle font-bold">Resumo dos últimos 6 meses:</p>
            <LastSixMonthsChart data={filterLock.current ? [] : data} />
        </section>
    )
}
