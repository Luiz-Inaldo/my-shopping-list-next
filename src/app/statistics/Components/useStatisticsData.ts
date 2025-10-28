"use client";

import { QUERY_KEYS } from "@/constants/queryKeys";
import { getActivePurchaseList } from "@/services/purchasesListServices";
import useGeneralUserStore from "@/store/generalUserStore";
import { IPurchaseProps } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Timestamp } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";

type TabType = "day" | "week" | "month";

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface MonthlyData {
  month: string;
  value: number;
}

export function useStatisticsData() {

  const userProfile = useGeneralUserStore((store) => store.userProfile);

  const { data: purchasesList } = useQuery<IPurchaseProps[]>({
    queryKey: [QUERY_KEYS.activePurchases],
    queryFn: async () => {
      const res = await getActivePurchaseList(userProfile?.uid as string);
      return res.data as unknown as IPurchaseProps[];
    },
  });

  const [activeTab, setActiveTab] = useState<TabType>("day");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Função para converter Timestamp do Firebase para Date
  const timestampToDate = useCallback((timestamp: Timestamp | null): Date => {
    if (!timestamp) return new Date();
    return timestamp.toDate();
  }, []);

  // Função para obter dados filtrados baseado na tab ativa
  const getFilteredData = useCallback((): IPurchaseProps[] => {
    if (!purchasesList || purchasesList.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (activeTab) {
      case "day":
        return purchasesList.filter((purchase) => {
          const purchaseDate = timestampToDate(purchase.end_date);
          return purchaseDate.toDateString() === today.toDateString();
        });

      case "week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return purchasesList.filter((purchase) => {
          const purchaseDate = timestampToDate(purchase.end_date);
          return purchaseDate >= weekStart && purchaseDate <= weekEnd;
        });

      case "month":
        return purchasesList.filter((purchase) => {
          const purchaseDate = timestampToDate(purchase.end_date);
          return (
            purchaseDate.getMonth() === selectedMonth &&
            purchaseDate.getFullYear() === selectedYear
          );
        });

      default:
        return [];
    }
  }, [purchasesList, activeTab, selectedMonth, selectedYear, timestampToDate]);

  // Função para obter dados do período anterior para comparação
  const getPreviousPeriodData = useCallback((): IPurchaseProps[] => {
    if (!purchasesList || purchasesList.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (activeTab) {
      case "day":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        return purchasesList.filter((purchase) => {
          const purchaseDate = timestampToDate(purchase.end_date);
          return purchaseDate.toDateString() === yesterday.toDateString();
        });

      case "week":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

        return purchasesList.filter((purchase) => {
          const purchaseDate = timestampToDate(purchase.end_date);
          return purchaseDate >= lastWeekStart && purchaseDate <= lastWeekEnd;
        });

      case "month":
        const previousMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const previousYear =
          selectedMonth === 0 ? selectedYear - 1 : selectedYear;

        return purchasesList.filter((purchase) => {
          const purchaseDate = timestampToDate(purchase.end_date);
          return (
            purchaseDate.getMonth() === previousMonth &&
            purchaseDate.getFullYear() === previousYear
          );
        });

      default:
        return [];
    }
  }, [purchasesList, activeTab, selectedMonth, selectedYear, timestampToDate]);

  // Função para calcular dados das categorias
  const getCategoryData = useCallback((): CategoryData[] => {
    const filteredData = getFilteredData();
    const totalValue = filteredData.reduce(
      (sum, purchase) => sum + purchase.total_price,
      0
    );

    if (totalValue === 0) return [];

    const categoryMap = new Map<string, number>();

    filteredData.forEach((purchase) => {
      if (purchase.purchase_items) {
        purchase.purchase_items.forEach((item) => {
          const currentValue = categoryMap.get(item.category) || 0;
          categoryMap.set(item.category, currentValue + Number(item.value));
        });
      }
    });

    const categories = Array.from(categoryMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
        percentage: (value / totalValue) * 100,
        color: getCategoryColor(name),
      })
    );

    return categories.sort((a, b) => b.value - a.value);
  }, [getFilteredData]);

  // Função para obter cor da categoria
  const getCategoryColor = useCallback((categoryName: string): string => {
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

    return categoryColors[categoryName] || "var(--category-10)";
  }, []);

  // Função para obter dados dos últimos 6 meses
  const getLastSixMonthsData = useCallback((): MonthlyData[] => {
    if (!purchasesList || purchasesList.length === 0) return [];

    const now = new Date();
    const monthsData: MonthlyData[] = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = targetDate.toLocaleDateString("pt-BR", {
        month: "long",
      });

      const monthPurchases = purchasesList.filter((purchase) => {
        const purchaseDate = timestampToDate(purchase.end_date);
        return (
          purchaseDate.getMonth() === targetDate.getMonth() &&
          purchaseDate.getFullYear() === targetDate.getFullYear()
        );
      });

      const totalValue = monthPurchases.reduce(
        (sum, purchase) => sum + purchase.total_price,
        0
      );

      monthsData.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        value: totalValue,
      });
    }

    return monthsData;
  }, [purchasesList, timestampToDate]);

  // Dados computados
  const filteredData = useMemo(() => getFilteredData(), [getFilteredData]);
  const previousPeriodData = useMemo(
    () => getPreviousPeriodData(),
    [getPreviousPeriodData]
  );
  const categoryData = useMemo(() => getCategoryData(), [getCategoryData]);
  const lastSixMonthsData = useMemo(
    () => getLastSixMonthsData(),
    [getLastSixMonthsData]
  );

  const totalPurchases = filteredData.length;
  const totalValue = filteredData.reduce(
    (sum, purchase) => sum + purchase.total_price,
    0
  );
  const previousTotalValue = previousPeriodData.reduce(
    (sum, purchase) => sum + purchase.total_price,
    0
  );

  return {
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    filteredData,
    categoryData,
    lastSixMonthsData,
    totalPurchases,
    totalValue,
    previousTotalValue,
  };
}
