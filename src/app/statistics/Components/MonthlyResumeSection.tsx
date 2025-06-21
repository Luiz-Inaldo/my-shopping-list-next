import { MonthlyStatisticsChart } from '@/components/Charts/MonthlyStatisticsChart';
import { MONTHS } from '@/constants/months';
import { YEARS } from '@/constants/years';
import { PurchasesContext } from '@/context/PurchasesContext';
import { IFilterProps, IPurchaseProps } from '@/types';
import { MonthlyFilterProps } from '@/types/charts';
import React, { useContext, useEffect, useRef, useState } from 'react'

export const MonthlyResumeSection = () => {

    const { purchasesList } = useContext(PurchasesContext);

    const [data, setData] = useState<IPurchaseProps[]>([]);
    const [filterStates, setFilterStates] = useState<MonthlyFilterProps>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        dataType: 'percentual'
    });

    const filterLock = useRef(true);

    // functions
    const filterPurchases = async (filter: IFilterProps) => {

        const month = filter.month as number;
        const year = filter.year as number;

        const filteredData = purchasesList.filter(purchase =>
            purchase.purchase_date.split("T")[0].split("-")[0] === year.toString() &&
            purchase.purchase_date.split("T")[0].split("-")[1] === String(month + 1).padStart(2, '0')
        );

        setData(filteredData);
    }

    useEffect(() => {
        if (!filterLock.current) {
            filterPurchases(filterStates);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStates, filterLock.current]);

    useEffect(() => {
        if (purchasesList.length > 0 && filterLock.current) {
            filterLock.current = false;
        }
    }, [purchasesList]);

    return (
        <section className="grid gap-5">
            <div>
                <p className="text-subtitle font-bold mb-3">Resumo mensal:</p>
                <div className='p-4 bg-app-container shadow-md border border-border rounded-sm'>
                    <p className="text-subtitle mb-5">Filtrar por:</p>
                    <div className="flex items-center gap-3 mb-3">
                        <select
                            value={filterStates.month}
                            onChange={(e) => {
                                setFilterStates((prev) => ({ ...prev, month: Number(e.target.value) }))
                            }}
                            className='flex-1 placeholder:text-paragraphdark text-paragraph bg-app-container dark:bg-app-background border rounded-sm px-3 py-2'
                        >
                            {MONTHS.map((month, index) => (
                                <option key={month} value={index}>{month}</option>
                            ))}
                        </select>
                        <p className="text-subtitle">de</p>
                        <select
                            value={filterStates.year}
                            onChange={(e) => {
                                setFilterStates((prev) => ({ ...prev, year: Number(e.target.value) }))
                            }}
                            className='flex-1 placeholder:text-paragraph text-paragraph bg-app-container dark:bg-app-background border rounded-sm px-3 py-2'
                        >
                            {YEARS.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <hr className='border-border mb-3'/>
                    <div className="flex items-center gap-3">
                        <p className='text-subtitle flex-1 w-full'>Tipo de visualização:</p>
                        <select
                            value={filterStates.dataType}
                            onChange={(e) => {
                                setFilterStates((prev) => ({ ...prev, dataType: e.target.value as MonthlyFilterProps['dataType'] }))
                            }}
                            className='placeholder:text-paragraph text-paragraph bg-app-container dark:bg-app-background border rounded-sm px-3 py-2'
                        >
                            <option value="percentual">Porcentagem</option>
                            <option value="value">Valor</option>
                        </select>
                    </div>
                </div>
            </div>
            <MonthlyStatisticsChart
                title={filterStates.dataType === 'percentual' ? 'Resumo por Categoria (%)' : 'Resumo por Categoria (R$)'}
                dataType={filterStates.dataType}
                data={filterLock.current ? [] : data}
            />
        </section>
    )
}
