import { TMonthlyStatisticsResponse } from "@/types";

/**
 * Agrupa as compras por mês e ano.
 */
export function groupPurchasesByMonth(data: TMonthlyStatisticsResponse) {
    return data.reduce((acc, purchase) => {
        if (!purchase.start_date) return acc;
        const date = new Date(purchase.start_date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(purchase);
        return acc;
    }, {} as Record<string, TMonthlyStatisticsResponse>);
}

/**
 * Calcula o gasto total de um conjunto de compras.
 */
export function calculateTotalSpending(purchases: TMonthlyStatisticsResponse) {
    return purchases.reduce(
        (total, purchase) => total + (purchase.total_price || 0),
        0
    );
}

/**
 * Retorna o total de listas.
 */
export function calculateTotalLists(purchases: TMonthlyStatisticsResponse) {
    return purchases.length || 0;
}

/**
 * Calcula o total de itens marcados como comprados.
 */
export function calculateTotalItemsBought(purchases: TMonthlyStatisticsResponse) {
    return purchases.reduce((total, purchase) => {
        const checkedItems =
            purchase.purchase_items?.filter((item) => item.checked).length || 0;
        return total + checkedItems;
    }, 0);
}

/**
 * Calcula a diferença de gastos entre o mês anterior e o atual (Anterior - Atual).
 */
export function calculateSpendingDifference(
    previousMonthPurchases: TMonthlyStatisticsResponse,
    currentMonthPurchases: TMonthlyStatisticsResponse
) {
    const previousSpending = calculateTotalSpending(previousMonthPurchases);
    const currentSpending = calculateTotalSpending(currentMonthPurchases);
    return previousSpending - currentSpending;
}

