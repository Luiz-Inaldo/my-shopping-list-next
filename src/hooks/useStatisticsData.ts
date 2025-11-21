"use client";

import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  getCurrentRangeEndDate,
  getCurrentRangeStartDate,
  getPreviousRangeEndDate,
  getPreviousRangeStartDate,
} from "@/functions/donutFilterDates";
import { usePurchasesQuery } from "@/hooks/queries/purchases";
import { getPurchasesList } from "@/services/purchasesListServices";
import useGeneralUserStore from "@/store/generalUserStore";
import { IPurchaseProps } from "@/types";
import { Filters } from "@/types/filters";
import { useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";

type TabType = "day" | "week" | "month";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyData {
  month: string;
  value: number;
}

const categoryColors: { [key: string]: string } = {
  Mercearia: "var(--category-1)",
  Limpeza: "var(--category-2)",
  "Frios e Laticínios": "var(--category-3)",
  "Carnes e Peixes": "var(--category-4)",
  Padaria: "var(--category-5)",
  "Higiene Pessoal": "var(--category-6)",
  Bebidas: "var(--category-7)",
  Congelados: "var(--category-8)",
  Hortifruti: "var(--category-9)",
  Outros: "var(--category-10)",
};

export function useStatisticsData() {

  // ===============
  // # States
  // ===============
  const [activeTab, setActiveTab] = useState<TabType>("day");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // ===============
  // # Filters
  // ===============
  const currentDataFilters = useMemo<Filters[]>(() => {
    return [
      {
        id: "end_date",
        operator: ">=",
        value: Timestamp.fromDate(
          getCurrentRangeStartDate(activeTab, selectedMonth, selectedYear)
        ),
      },
      {
        id: "end_date",
        operator: "<=",
        value: Timestamp.fromDate(
          getCurrentRangeEndDate(activeTab, selectedMonth, selectedYear)
        ),
      }
    ];
  }, [activeTab, selectedMonth, selectedYear]);

  const previousDataFilters = useMemo<Filters[]>(() => {

    return [
      {
        id: "end_date",
        operator: ">=",
        value: Timestamp.fromDate(
          getPreviousRangeStartDate(activeTab, selectedMonth, selectedYear)
        ),
      },
      {
        id: "end_date",
        operator: "<=",
        value: Timestamp.fromDate(
          getPreviousRangeEndDate(activeTab, selectedMonth, selectedYear)
        ),
      }
    ];
  }, [activeTab, selectedMonth, selectedYear])

  const [areaChartFilters, setAreaChartFilters] = useState<Filters[]>([
    {
      id: "is_active",
      operator: "==",
      value: false,
    },
  ]);

  // ===============
  // # React Query
  // ===============
  const { data: donutChartPurchasesList } = usePurchasesQuery(currentDataFilters);
  const { data: previousPurchasesData } = usePurchasesQuery(previousDataFilters, Boolean(donutChartPurchasesList));

  console.log("dados do gráfico Donut:", donutChartPurchasesList);
  console.log("dados anteriores:", previousPurchasesData);

  // Função para calcular dados das categorias
  const chartCategoryData = useMemo((): CategoryData[] => {
    if (!donutChartPurchasesList || donutChartPurchasesList.length === 0)
      return [];

    const categoryMap = new Map<string, number>();

    donutChartPurchasesList.forEach((purchase) => {
      const purchaseItems = purchase.purchase_items;

      if (!purchaseItems) return [];

      purchaseItems.forEach((item) => {
        const category = item.category;
        if (categoryMap.has(category)) {
          categoryMap.set(
            category,
            (categoryMap.get(category) || 0) +
              Number(item.quantity) * Number(item.value)
          );
        } else {
          categoryMap.set(category, Number(item.quantity) * Number(item.value));
        }
      });
    });

    return Array.from(categoryMap.entries()).map(([category, value]) => ({
      name: category,
      value: value,
      color: categoryColors[category] || "var(--category-10)",
    }));

  }, [donutChartPurchasesList]);

  // Função para obter dados dos últimos 6 meses
  // const getLastSixMonthsData = useCallback((): MonthlyData[] => {
  //   if (!purchasesList || purchasesList.length === 0) return [];

  //   const now = new Date();
  //   const monthsData: MonthlyData[] = [];

  //   for (let i = 5; i >= 0; i--) {
  //     const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
  //     const monthName = targetDate.toLocaleDateString("pt-BR", {
  //       month: "long",
  //     });

  //     const monthPurchases = purchasesList.filter((purchase) => {
  //       const purchaseDate = timestampToDate(purchase.end_date);
  //       return (
  //         purchaseDate.getMonth() === targetDate.getMonth() &&
  //         purchaseDate.getFullYear() === targetDate.getFullYear()
  //       );
  //     });

  //     const totalValue = monthPurchases.reduce(
  //       (sum, purchase) => sum + purchase.total_price,
  //       0
  //     );

  //     monthsData.push({
  //       month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
  //       value: totalValue,
  //     });
  //   }

  //   return monthsData;
  // }, [purchasesList]);

  // // Dados computados
  // const filteredData = useMemo(() => getFilteredData(), [getFilteredData]);
  // const previousPeriodData = useMemo(
  //   () => getPreviousPeriodData(),
  //   [getPreviousPeriodData]
  // );
  // const categoryData = useMemo(() => getCategoryData(), [getCategoryData]);
  // const lastSixMonthsData = useMemo(
  //   () => getLastSixMonthsData(),
  //   [getLastSixMonthsData]
  // );

  // const totalPurchases = filteredData.length;
  const totalValue = donutChartPurchasesList?.reduce(
    (sum, purchase) => sum + purchase.total_price,
    0
  ) || 0;
  const previousTotalValue = previousPurchasesData?.reduce(
    (sum, purchase) => sum + purchase.total_price,
    0
  ) || 0;

  return {
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    chartCategoryData,
    // filteredData,
    // categoryData,
    // lastSixMonthsData,
    // totalPurchases,
    totalValue,
    previousTotalValue,
  };
}
