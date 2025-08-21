import { ShoppingCart, TrendingUp } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { useShoplistContext } from "@/context/ShoplistContext";
import { formatCurrency } from "@/functions/formatCurrency";
import { useCallback, useEffect } from "react";
import { AnimatedCircularProgressBar } from "../magicui/animated-circular-progress-bar";

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
            <div className="flex items-center py-3 gap-8 border-b border-app-border">
                <div className="flex items-center justify-center pl-4">
                    <AnimatedCircularProgressBar
                        min={0}
                        max={100}
                        value={calculateTotalProgress()}
                    />
                </div>
                <div className="shrink-0 flex-1 grid gap-1 items-center">
                    <div className="text-subtitle ">
                        <p className="text-sm">Itens</p>
                        <p className="text-lg font-semibold">{auxData?.purchase_items?.length || 0}</p>
                    </div>
                    <div>
                        <p className="text-sm text-subtitle">Valor atual</p>
                        <p className="text-lg font-semibold text-default-green">{formatCurrency(totalValue || 0)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-subtitle">Orçamento</p>
                        <p className="text-lg font-semibold text-action">{formatCurrency(auxData?.max_value || 0)}</p>
                    </div>
                </div>
            </div>
            {/* <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-paragraph">
                    <p>orçamento estabelecido</p>
                    <p className="italic">
                        {formatCurrency(totalValue || 0)} / {formatCurrency(auxData?.max_value || 0)}
                    </p>
                </div>
                <Progress value={calculateTotalProgress()} />
            </div> */}
            <Button className="w-full">
                <ShoppingCart />
                <p>Finalizar Compra</p>
            </Button>
        </div>
    )
}
