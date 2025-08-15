import { ShoppingCart, TrendingUp } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";

export function FinancialSummary() {
    return (
        <div className="bg-app-container rounded-lg p-3 space-y-4 shadow border border-app-border">
            <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                <h3 className="text-sm text-subtitle">Resumo financeiro</h3>
            </div>
            <div className="flex items-center">
                <div className="flex-1 text-subtitle text-center">
                    <p className="text-sm">Itens</p>
                    <p className="text-lg font-semibold">0</p>
                </div>
                <div className="flex-1 text-center">
                    <p className="text-sm">Valor atual</p>
                    <p className="text-lg font-semibold text-app-primary">R$: 0,00</p>
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-paragraph">
                    <p>orçamento estabelecido</p>
                    <p className="italic">R$: 0,00 / R$: 500,00</p>
                </div>
                <Progress value={0} />
            </div>
            <Button className="w-full">
                <ShoppingCart />
                <p>Finalizar Compra</p>
            </Button>
        </div>
    )
}
