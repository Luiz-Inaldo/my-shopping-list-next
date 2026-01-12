import { IPurchaseProps } from "@/types";

export function getYears(purchasesList: IPurchaseProps[]): number[] {
    if (!purchasesList) return [];
    
    const yearsSet: Set<number> = new Set();
    for (const purchase of purchasesList) {
        const year = purchase.end_date?.toDate().getFullYear();
        if (year) yearsSet.add(year);
    }
    return Array.from(yearsSet);
}