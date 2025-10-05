import { ShoppingCart, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { useShoplistContext } from "@/context/ShoplistContext";
import { formatCurrency } from "@/functions/formatCurrency";
import { useCallback, useEffect } from "react";
import { AnimatedCircularProgressBar } from "../magicui/animated-circular-progress-bar";
import FinalizePurchaseModal from "../Modal/FinalizePurchaseModal";
import { sleep } from "@/functions/sleep";
import { saveCurrentPurchase } from "@/services/purchasesListServices";
import { IPurchaseProps } from "@/types";
import { sendToastMessage } from "@/functions/sendToastMessage";

export function FinancialSummary({ setSavingModalOpen, setIsSaved }: {
    setSavingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const { auxData, totalValue } = useShoplistContext();

    const calculateTotalProgress = useCallback(() => {

        let progress: number;

        if (!auxData) return 0;

        const totalCurrentListValue = totalValue;
        const totalMaxValue = auxData.max_value;

        progress = Math.min(100, (totalCurrentListValue / totalMaxValue) * 100);

        return progress;

    }, [auxData, totalValue]);

    async function handleFinalizePurchase() {
        await sleep(0.5);
        setSavingModalOpen(true);
        try {

            // estilo sendo inferido dessa forma pois o modal aberto não usa nenhuma lib
            // e a página principal pode conter overflow scroll por conta da quantidade
            // de produtos
            document.body.style.overflow = 'hidden';
            
            const endDate = new Date().toISOString();
            const purchase = {
                ...auxData,
                end_date: endDate
            } as IPurchaseProps;

            await saveCurrentPurchase(purchase);
            setIsSaved(true);
        } catch (error) {
            console.error("Error saving purchase:", error);
            sendToastMessage({
                title: "Erro ao salvar compra",
                type: "error"
            })
        } finally {
            document.body.style.overflow = 'auto';
            setSavingModalOpen(false);
        }
    }
    return (
        <div className="bg-app-container rounded-lg p-3 space-y-4 shadow border border-app-border">
            <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                <h3 className="text-subtitle">Resumo financeiro</h3>
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
            <FinalizePurchaseModal
                onFinalize={handleFinalizePurchase}
                trigger={
                    <Button
                        disabled={totalValue <= 0}
                        className="w-full">
                        <ShoppingCart />
                        <p>Finalizar Compra</p>
                    </Button>
                }
            />
        </div>
    )
}
