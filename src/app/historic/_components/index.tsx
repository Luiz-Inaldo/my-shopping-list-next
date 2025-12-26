"use client";
import { HistoricList } from '@/app/historic/_components/HistoricList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MONTHS } from '@/constants/months';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { YEARS } from '@/constants/years';
import useGeneralUserStore from '@/store/generalUserStore';
import { IFilterProps, IPurchaseProps } from '@/types';
import { queryClient } from '@/utils/queryClient';
import { useEffect, useRef, useState } from 'react';
import Header from '../../../components/Header';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Filters } from '@/types/filters';
import { usePurchasesQuery } from '@/hooks/queries/purchases';
import { AppAlert } from '@/components/Alerts';

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
    const filters: Filters[] = [{
        id: "is_active",
        operator: "==",
        value: false
    }];
    const [auxData, setAuxData] = useState<IPurchaseProps[]>([]);

    // ===================
    // # React Query
    // ===================
    const { data: historicData, isLoading, isFetching, isError, refetch } = usePurchasesQuery(filters);

    // ===================
    // # Refs
    // ===================
    const isFirstLoad = useRef<boolean>(true);

    const filterPurchases = async (filter: IFilterProps) => {

        // if (purchasesList.length === 0) filterPurchases(filter);

        const month = filter.month;
        const year = filter.year;

        // primeiro caso: os dois parâmetros são string
        if (typeof month === "string" && typeof year === "string") {
            queryClient.setQueryData([QUERY_KEYS.purchases, userProfile?.uid, filters], auxData);
        }
        // segundo caso: ambos parâmetros number
        else if (typeof month === 'number' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase =>
                purchase.end_date?.toDate().getFullYear() === year &&
                purchase.end_date?.toDate().getMonth() === month
            );

            queryClient.setQueryData([QUERY_KEYS.purchases, userProfile?.uid, filters], filteredData);

        }
        // terceiro caso: mês string e ano number
        else if (typeof month === 'string' && typeof year === 'number') {

            const filteredData = auxData.filter(purchase =>
                purchase.end_date?.toDate().getFullYear() === year
            );

            queryClient.setQueryData([QUERY_KEYS.purchases, userProfile?.uid, filters], filteredData);

        }
        // quarto caso: mês number e ano string
        else if (typeof month === 'number' && typeof year === 'string') {

            const filteredData = auxData.filter(purchase =>
                purchase.end_date?.toDate().getMonth() === month
            );

            queryClient.setQueryData([QUERY_KEYS.purchases, userProfile?.uid, filters], filteredData);

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

    // ===============
    // # Effects
    // ===============
    useEffect(() => {
        const purchasesRef = collection(db, 'purchases');
        const unsubscribe = onSnapshot(purchasesRef, (snapshot) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.purchases, userProfile?.uid, filters]
            });
            setAuxData(snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                  } as IPurchaseProps;
            }));
        });
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile?.uid]);

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
            <div className="w-full px-5 pb-24 pt-6">
                {userProfile?.emailPendencies && (
                    <AppAlert type="email" className="mb-10" />
                )}
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
