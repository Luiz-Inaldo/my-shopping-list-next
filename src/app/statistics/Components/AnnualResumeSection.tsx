import { AnnualStatisticsChart } from '@/components/Charts/AnnualStatisticsChart';
import { YEARS } from '@/constants/years';
import { PurchasesContext } from '@/context/PurchasesContext';
import { IPurchaseProps } from '@/types';
import { AnnualFilterProps } from '@/types/charts';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

const AnnualResumeSection = () => {

    const { purchasesList } = useContext(PurchasesContext);
    
    const [data, setData] = useState<IPurchaseProps[]>([]);
    const [filterStates, setFilterStates] = useState<AnnualFilterProps>({
        year: new Date().getFullYear(),
        dataType: 'percentual'
    });

    const filterLock = useRef(true);

    // functions
    const filterPurchases = useCallback(async (filter: AnnualFilterProps) => {

        const year = filter.year as number;

        const filteredData = purchasesList.filter(purchase =>
            purchase.purchase_date.split("T")[0].split("-")[0] === year.toString()
        );

        setData(filteredData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStates.year, purchasesList])

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
                <p className="text-paragraphdark font-bold mb-3">Resumo anual:</p>
                <div className='p-4 bg-secondary-dark rounded-sm'>
                    <p className="text-paragraphdark mb-5">Filtrar por:</p>
                    <div className="flex flex-col justify-center gap-3">
                        <div className="flex items-center gap-3">
                            <p className="text-paragraphdark">Ano:</p>
                            <select
                                value={filterStates.year}
                                onChange={(e) => {
                                    setFilterStates((prev) => ({ ...prev, year: Number(e.target.value) }))
                                }}
                                className='max-w-25 placeholder:text-paragraphdark text-paragraphdark bg-primary-dark rounded-sm px-3 py-2'
                            >
                                {YEARS.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <hr className='border-paragraphdark/30'/>
                        <div className="flex flex-1 items-center gap-3">
                            <p className="text-paragraphdark">Tipo de visualização:</p>
                            <select
                                value={filterStates.dataType}
                                onChange={(e) => {
                                    setFilterStates((prev) => ({ ...prev, dataType: e.target.value as AnnualFilterProps['dataType'] }))
                                }}
                                className='max-w-25 placeholder:text-paragraphdark text-paragraphdark bg-primary-dark rounded-sm px-3 py-2'
                            >
                                <option value="percentual">Porcentagem</option>
                                <option value="value">Valor</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <AnnualStatisticsChart
                title={filterStates.dataType === 'percentual' ? 'Resumo por Categoria (%)' : 'Resumo por Categoria (R$)'}
                dataType={filterStates.dataType}
                data={filterLock.current ? [] : data}
            />
        </section>
    )
}

export default AnnualResumeSection