import { AnnualStatisticsChart } from '@/components/Charts/AnnualStatisticsChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

        const year = Number(filter.year);

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
                <p className="text-subtitle font-bold mb-3">Resumo anual:</p>
                <div className='p-4 bg-app-container border border-border shadow-md rounded-sm'>
                    <p className="text-subtitle mb-5">Filtrar por:</p>
                    <div className="flex flex-col justify-center gap-3">
                        <div className="flex items-center gap-3">
                            <p className="text-subtitle">Ano:</p>
                            <Select
                                defaultValue={filterStates.year.toString()}
                                onValueChange={(value) => {
                                    setFilterStates((prev) => ({ ...prev, year: Number(value) }))
                                }}
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Ano" />
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map((year) => (
                                        <SelectItem key={year} value={String(year)}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* <select
                                value={filterStates.year}
                                onChange={(e) => {
                                    setFilterStates((prev) => ({ ...prev, year: Number(e.target.value) }))
                                }}
                                className='max-w-25 placeholder:text-paragraph text-paragraph bg-app-container dark:bg-app-background border rounded-sm px-3 py-2'
                            >
                                {YEARS.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select> */}
                        </div>
                        <hr className='border-border'/>
                        <div className="flex flex-1 items-center gap-3">
                            <p className="text-subtitle">Tipo de visualização:</p>
                            <Select
                                defaultValue={filterStates.dataType}
                                onValueChange={(value) => {
                                    setFilterStates((prev) => ({ ...prev, dataType: value as AnnualFilterProps['dataType'] }))
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Tipo de visualização" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentual">Porcentagem</SelectItem>
                                    <SelectItem value="value">Valor</SelectItem>
                                </SelectContent>
                            </Select>
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