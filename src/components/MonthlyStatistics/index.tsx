'use client';

import { DollarSign, Goal, ShoppingCart, TrendingUp } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext } from '../ui/carousel';
import { useQuery } from '@tanstack/react-query';
import useGeneralUserStore from '@/store/generalUserStore';
import { useEffect, useMemo, useState } from 'react';
import { Filters } from '@/types/filters';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { getPreviousRangeStartDate } from '@/functions/donutFilterDates';
import { createMonthlyStatisticsQuery } from '@/hooks/queries/monthly-statistics';
import { TMonthlyStatisticsData, TMonthlyStatisticsResponse } from '@/types';
import { formatCurrency } from '@/functions/formatCurrency';
import { db } from '@/lib/firebase';
import { queryClient } from '@/utils/queryClient';
import { QUERY_KEYS } from '@/constants/queryKeys';

export function MonthlyStatistics() {

  const userId = useGeneralUserStore((store) => store.userProfile?.uid);

  const [monthlyStatisticsData, setMonthlyStatisticsData] = useState<TMonthlyStatisticsData | null>(null);

  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const filters = useMemo<Filters[]>(() => [
    {
      id: 'end_date',
      operator: '>=',
      value: Timestamp.fromDate(
        getPreviousRangeStartDate('month', month, year)
      ),
    },
    {
      id: 'end_date',
      operator: '<=',
      value: Timestamp.fromDate(new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999))),
    },
  ], [month, year]);

  const { data: monthlyStatisticsResponse } = useQuery(createMonthlyStatisticsQuery(userId, filters));

  function groupPurchasesByMonth(data: TMonthlyStatisticsResponse) {
    return data.reduce((acc, purchase) => {
      if (!purchase.start_date) return acc;
      const date = new Date(purchase.start_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(purchase);
      return acc;
    }, {} as Record<string, TMonthlyStatisticsResponse>);
  }

  function calculateTotalSpending(purchases: TMonthlyStatisticsResponse) {
    return purchases.reduce((total, purchase) => total + (purchase.total_price || 0), 0);
  }

  function calculateTotalLists(purchases: TMonthlyStatisticsResponse) {
    return purchases.length;
  }

  function calculateTotalItemsBought(purchases: TMonthlyStatisticsResponse) {
    return purchases.reduce((total, purchase) => {
      const checkedItems = purchase.purchase_items?.length || 0;
      return total + checkedItems;
    }, 0);
  }

  function calculateSpendingDifference(previousMonthPurchases: TMonthlyStatisticsResponse, currentMonthPurchases: TMonthlyStatisticsResponse) {
    const previousSpending = calculateTotalSpending(previousMonthPurchases);
    const currentSpending = calculateTotalSpending(currentMonthPurchases);
    return previousSpending - currentSpending;
  }

  function formatMonthlyStatisticsData(data: TMonthlyStatisticsResponse) {
    const groupedData = groupPurchasesByMonth(data);

    const currentMonthKey = `${year}-${month}`;
    const previousDate = getPreviousRangeStartDate('month', month, year);
    const previousMonthKey = `${previousDate.getFullYear()}-${previousDate.getMonth()}`;

    const currentMonthPurchases = groupedData[currentMonthKey] || [];
    const previousMonthPurchases = groupedData[previousMonthKey] || [];

    const result = {
      currentMonthSpending: calculateTotalSpending(currentMonthPurchases),
      currentMonthListsCount: calculateTotalLists(currentMonthPurchases),
      currentMonthItemsCount: calculateTotalItemsBought(currentMonthPurchases),
      spendingDifference: calculateSpendingDifference(previousMonthPurchases, currentMonthPurchases),
    };

    setMonthlyStatisticsData(result);
  }

  useEffect(() => {

    if (!monthlyStatisticsResponse) return;

    formatMonthlyStatisticsData(monthlyStatisticsResponse);

  }, [monthlyStatisticsResponse])

  useEffect(() => {
    const purchasesRef = collection(db, 'purchases');
    const unsubscribe = onSnapshot(purchasesRef, (snapshot) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.monthlyStatistics, userId, filters] });
    });
    return () => unsubscribe();
  }, [filters, userId]);

  return (
    <div className="min-h-[100px] justify-center p-4 bg-app-container rounded-lg shadow-sm space-y-3">
      <h3 className="text-subtitle text-sm font-medium">
        Estatísticas Mensais
      </h3>
      <Carousel
        opts={{
          align: 'start',
          loop: true
        }}
        className="relative"
      >
        <CarouselContent>
          <CarouselItem className="basis-1/2">
            <div className="space-y-1 h-full col-span-2 border text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/60 p-2 rounded-lg border-green-100 dark:border-green-900">
              <div className="flex items-center gap-2">
                <DollarSign size={14} />
                <span className="text-xs font-medium">Gastos Totais</span>
              </div>
              <p className="font-semibold text-green-800 dark:text-green-600">
                {formatCurrency(monthlyStatisticsData?.currentMonthSpending || 0)}
              </p>
            </div>
          </CarouselItem>
          <CarouselItem className="basis-1/2">
            <div className="space-y-1 h-full col-span-2 border text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 p-2 rounded-lg border-sky-100 dark:border-sky-900">
              <div className="flex items-center gap-2">
                <ShoppingCart size={14} />
                <span className="text-xs font-medium">Listas Finalizadas</span>
              </div>
              <p className="font-semibold text-sky-800 dark:text-sky-600">{monthlyStatisticsData?.currentMonthListsCount}</p>
            </div>
          </CarouselItem>
          <CarouselItem className="basis-1/2">
            <div className="space-y-1 h-full col-span-2 border text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 p-2 rounded-lg border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-2">
                <Goal size={14} />
                <span className="text-xs font-medium">Itens Adquiridos</span>
              </div>
              <p className="font-semibold text-purple-800 dark:text-purple-600">
                {monthlyStatisticsData?.currentMonthItemsCount}
              </p>
            </div>
          </CarouselItem>
          <CarouselItem className="basis-1/2">
            <div className="space-y-1 h-full col-span-2 border text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 p-2 rounded-lg border-orange-100 dark:border-orange-900">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">Economia no mês</span>
              </div>
              <p className="font-semibold text-orange-800 dark:text-orange-600">
                {formatCurrency(monthlyStatisticsData?.spendingDifference || 0)}
              </p>
            </div>
          </CarouselItem>
        </CarouselContent>
        {/* <CarouselPrevious className="absolute border-none text-app-primary -top-6 right-9 left-[unset] hover:bg-app-primary/50 size-8 rounded-full flex items-center justify-center" /> */}
        <CarouselNext className="absolute border-none text-app-primary -top-6 right-0 hover:bg-app-primary/50 size-8 rounded-full flex items-center justify-center" />
      </Carousel>
    </div>
  );
}
