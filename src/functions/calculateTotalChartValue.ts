import { IProductProps, IPurchaseProps } from "@/types";
import { calculatePercentage } from "./categoryPercentage";

export function calculateTotalChartValue(purchases: IPurchaseProps[], dataType: 'percentual' | 'value', categoryName: string): number {
    
    let total: number = 0;
    let items: IProductProps[] = [];

    for (const purchase of purchases) {
        items = [... items, ...JSON.parse(purchase.purchase_items) ];
    }

    if (dataType === 'percentual') {
        let totalPercentage: number = 0;
        totalPercentage = Number(calculatePercentage(items, categoryName)?.replace('%', ''))
        total = totalPercentage;
    } else {
        let totalValue: number = 0;
        totalValue = items.reduce((acc, item) => {
            if (item.category.toLowerCase() === categoryName.toLowerCase()) {
                return acc + (item.quantity * parseFloat(item.value.replace(',', '.')));
            } else {
                return acc;
            }
        }, 0)
        total = totalValue;
    }

    return total;
}