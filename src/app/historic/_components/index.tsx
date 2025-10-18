"use client";
import { HistoricList } from '@/app/historic/_components/HistoricList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MONTHS } from '@/constants/months';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { YEARS } from '@/constants/years';
import { fetchHistoricData } from '@/services/historicServices';
import useGeneralUserStore from '@/store/generalUserStore';
import { IFilterProps, IPurchaseProps } from '@/types';
import { queryClient } from '@/utils/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import Header from '../../../components/Header';

export function HistoricPage() {

    // ===================
    // # Store
    // ===================
    const userProfile = useGeneralUserStore(s => s.userProfile);

    // ===================
    // # States
    // ===================
    const [filterStates, setFilterStates] = useState<IFilterProps>({
        month: "todos",
        year: "todos",
    });
    const [auxData, setAuxData] = useState<IPurchaseProps[]>([]);

    // ===================
    // # React Query
    // ===================
    const { data: historicData, isLoading, isFetching, isError, refetch } = useQuery<IPurchaseProps[]>({
        queryKey: [QUERY_KEYS.historic, userProfile?.uid],
        queryFn: handleFetchHistoricData,
        enabled: !!userProfile?.uid
    })

    // ===================
    // # Refs
    // ===================
    const isFirstLoad = useRef<boolean>(true);

    // ===================
    // # Handlers
    // ===================
    async function handleFetchHistoricData(): Promise<IPurchaseProps[]> {
        const res = await fetchHistoricData(userProfile?.uid!);
        setAuxData(res);
        return res;
    }

    const filterPurchases = async (filter: IFilterProps) => {

        // if (purchasesList.length === 0) filterPurchases(filter);

        const month = filter.month;
        const year = filter.year;

        // primeiro caso: os dois parâmetros são string
        if (typeof month === "string" && typeof year === "string") {
            queryClient.setQueryData([QUERY_KEYS.historic, userProfile?.uid], auxData);
        }
        // segundo caso: ambos parâmetros number
        else if (typeof month === 'number' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase =>
                purchase.end_date?.split("T")[0].split("-")[0] === year.toString() &&
                purchase.end_date?.split("T")[0].split("-")[1] === String(month + 1).padStart(2, '0')
            );

            queryClient.setQueryData([QUERY_KEYS.historic, userProfile?.uid], filteredData);

        }
        // terceiro caso: mês string e ano number
        else if (typeof month === 'string' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase =>
                purchase.end_date?.split("T")[0].split("-")[0] === year.toString()
            );

            queryClient.setQueryData([QUERY_KEYS.historic, userProfile?.uid], filteredData);

        }
        // quarto caso: mês number e ano string
        else if (typeof month === 'number' && typeof year === 'string') {

            const filteredData = auxData.filter(purchase =>
                purchase.end_date?.split("T")[0].split("-")[1] === String(month + 1).padStart(2, '0')
            );

            queryClient.setQueryData([QUERY_KEYS.historic, userProfile?.uid], filteredData);

        }
    };

    function handleFilters(value: string, type: string) {

        if (value === "todos") {
            setFilterStates((prev) => ({ ...prev, [type]: value }));
        } else {
            setFilterStates(prev => ({
                ...prev,
                [type]: parseInt(value)
            }));
        }
    };

    useEffect(() => {
        if (historicData && auxData.length > 0) {
            filterPurchases(filterStates);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStates]);

    useEffect(() => {
        if (isFirstLoad.current && historicData) {
            setAuxData(historicData);
            isFirstLoad.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [historicData]);

    return (
        <>
            <Header className="text-lg font-medium">
                Histórico
            </Header>
            <div className="w-full px-5 py-6">
                <div className="grid 2xsm:grid-cols-1 gap-10">
                    <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                        <label className="relative flex-1 col-span-1">
                            <span className="text-subtitle font-medium">Mês</span>
                            <Select onValueChange={(value) => handleFilters(value, "month")}>
                                <SelectTrigger className="bg-app-container">
                                    <SelectValue placeholder="Todos os meses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os meses</SelectItem>
                                    {MONTHS.map((month, index) => (
                                        <SelectItem key={month} value={String(index)}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>

                        <label className="relative flex-1 col-span-1">
                            <span className="text-subtitle font-medium">Ano</span>
                            <Select onValueChange={(value) => handleFilters(value, "year")}>
                                <SelectTrigger className="bg-app-container">
                                    <SelectValue placeholder="Todos os anos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os anos</SelectItem>
                                    {YEARS.map((year) => (
                                        <SelectItem key={year} value={String(year)}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>
                    </div>

                    <HistoricList
                        isLoading={isLoading}
                        hasError={isError}
                        data={historicData}
                        retryFn={refetch}
                        isFetching={isFetching}
                    />

                </div>
            </div>
        </>
    )
}
