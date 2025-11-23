"use client";

import { MONTHS } from "@/constants/months";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { getLastSixMonthsDate } from "@/functions/charts/areaChartFilterDates";
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
      },
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
      },
    ];
  }, [activeTab, selectedMonth, selectedYear]);

  const areaChartFilters = useMemo<Filters[]>(() => {
    return [
      {
        id: "end_date",
        operator: ">=",
        value: Timestamp.fromDate(getLastSixMonthsDate().date),
      },
      {
        id: "end_date",
        operator: "<=",
        value: Timestamp.fromDate(
          new Date(Date.UTC(selectedYear, selectedMonth + 1, 0, 3, 0, 0, 0))
        ),
      },
    ];
  }, [selectedMonth, selectedYear]);
  
  // ===============
  // # React Query
  // ===============
  const { data: donutChartPurchasesList } =
    usePurchasesQuery(currentDataFilters);
  const { data: previousPurchasesData } = usePurchasesQuery(
    previousDataFilters,
    Boolean(donutChartPurchasesList)
  );
  const { data: areaChartPurchasesList } = usePurchasesQuery(areaChartFilters);

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
  
  const areaChartData = useMemo<MonthlyData[]>(() => {
    if (!areaChartPurchasesList || areaChartPurchasesList.length === 0) return [];
    const uniqueMonths = getLastSixMonthsDate().range;

    return uniqueMonths.map(month => ({
      month: MONTHS[Number(month?.split("-")[1]) - 1],
      value: areaChartPurchasesList.filter(p => p.end_date?.toDate().toISOString().slice(0,7) === month).reduce((sum, p) => sum + p.total_price, 0)
    })) as MonthlyData[];
  }, [areaChartPurchasesList]);

  const totalPurchases = donutChartPurchasesList?.length || 0;
  const totalValue =
    donutChartPurchasesList?.reduce(
      (sum, purchase) => sum + purchase.total_price,
      0
    ) || 0;
  const previousTotalValue =
    previousPurchasesData?.reduce(
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
    areaChartData,
    totalPurchases,
    totalValue,
    previousTotalValue,
  };
}
