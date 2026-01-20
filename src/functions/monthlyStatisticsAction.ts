"use server";

import { getPurchasesList } from "@/services/purchasesListServices";
import { monthlyStatisticsFlow } from "./aiFlows";

export async function getMonthlyStatistics(userId: string) {
  try {
    const { data } = await getPurchasesList(userId);

    // Converte Timestamps para string para evitar problemas de serialização
    const serializedData = data.map((item) => ({
      ...item,
      start_date: item.start_date ? new Date(item.start_date.seconds * 1000).toISOString() : null,
      end_date: item.end_date ? new Date(item.end_date.seconds * 1000).toISOString() : null,
    }));

    const result = await monthlyStatisticsFlow({ userId, purchases: serializedData });
    return result;
  } catch (error) {
    console.error("Erro ao gerar estatísticas mensais:", error);
    throw new Error("Falha ao gerar estatísticas mensais");
  }
}
