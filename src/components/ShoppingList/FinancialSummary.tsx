import { ShoppingCart, TrendingUp } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { useShoplistContext } from "@/context/ShoplistContext";
import { formatCurrency } from "@/functions/formatCurrency";
import { useCallback, useEffect } from "react";

export function FinancialSummary() {

    const { auxData, totalValue } = useShoplistContext();

    const calculateTotalProgress = useCallback(() => {

        let progress: number;

        if (!auxData) return 0;
        
        const totalCurrentListValue = totalValue;
        const totalMaxValue = auxData.max_value;
        
        progress = Math.min(100, (totalCurrentListValue / totalMaxValue) * 100);

        return progress;
        
    }, [auxData, totalValue]);

    return (
        <div className="bg-app-container rounded-lg p-3 space-y-4 shadow border border-app-border">
            <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                <h3 className="text-sm text-subtitle">Resumo financeiro</h3>
            </div>
            <div className="flex items-center">
                <div className="flex-1 text-subtitle text-center">
                    <p className="text-sm">Itens</p>
                    <p className="text-lg font-semibold">{auxData?.purchase_items?.length || 0}</p>
                </div>
                <div className="flex-1 text-center">
                    <p className="text-sm text-subtitle">Valor atual</p>
                    <p className="text-lg font-semibold text-app-primary">{formatCurrency(totalValue || 0)}</p>
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-paragraph">
                    <p>orçamento estabelecido</p>
                    <p className="italic">
                        {formatCurrency(totalValue || 0)} / {formatCurrency(auxData?.max_value || 0)}
                    </p>
                </div>
                <Progress value={calculateTotalProgress()} />
            </div>
            <Button className="w-full">
                <ShoppingCart />
                <p>Finalizar Compra</p>
            </Button>
        </div>
    )
}
