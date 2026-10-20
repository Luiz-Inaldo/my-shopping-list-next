'use client';

import {
  ChartNoAxesColumnIncreasing,
  CircleAlert,
  CircleX,
  ShoppingCart,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useShoplistContext } from '@/context/ShoplistContext';
import { useMemo, useState } from 'react';
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar';
import FinalizePurchaseModal from '@/components/Modal/FinalizePurchaseModal';
import { sleep } from '@/functions/sleep';
import { saveCurrentPurchase } from '@/services/purchasesListServices';
import { IPurchaseProps } from '@/types';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { Timestamp } from 'firebase/firestore';
import { formatCurrency } from '@/functions/formatCurrency';
import { invalidateAllQueries } from '@/functions/invalidadeQueries';
import { QUERY_KEYS } from '@/constants/queryKeys';
import useGeneralUserStore from '@/store/generalUserStore';

interface IFinancialSummarySheetProps {
  setSavingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

export function FinancialSummarySheet({
  setSavingModalOpen,
  setIsSaved,
}: IFinancialSummarySheetProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { auxData, totalValue } = useShoplistContext();
  const userId = useGeneralUserStore((s) => s.userProfile?.uid);

  const totalProgress = useMemo(() => {
    let progress: number;

    if (!auxData) return 0;

    const totalCurrentListValue = totalValue;
    const totalMaxValue = auxData.max_value;

    progress = Math.min(100, (totalCurrentListValue / totalMaxValue) * 100);

    return progress;
  }, [auxData, totalValue]);

  const totalCheckedItems = useMemo(() => {
    if (!auxData) return 0;

    return auxData.purchase_items?.filter((item) => item.checked).length || 0;
  }, [auxData]);

  async function handleFinalizePurchase() {
    await sleep(0.5);
    setSavingModalOpen(true);
    try {
      // estilo sendo inferido dessa forma pois o modal aberto não usa nenhuma lib
      // e a página principal pode conter overflow scroll por conta da quantidade
      // de produtos
      document.body.style.overflow = 'hidden';

      const checkedProducts = auxData?.purchase_items?.filter(
        (item) => item.checked
      );

      const purchase = {
        ...auxData,
        purchase_items: checkedProducts || [],
        end_date: Timestamp.fromDate(new Date()),
        total_price: totalValue,
      } as IPurchaseProps;

      await saveCurrentPurchase(purchase);
      setIsSaved(prev => !prev);
      invalidateAllQueries([[QUERY_KEYS.purchases, userId]]);
      setOpen(false)
    } catch (error) {
      console.error('Error saving purchase:', error);
      sendToastMessage({
        title: 'Erro ao salvar compra',
        type: 'error',
      });
    } finally {
      document.body.style.overflow = 'auto';
      setSavingModalOpen(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="h-fit rounded-sketch-btn p-1">
          <ChartNoAxesColumnIncreasing size={20} strokeWidth={2.5} />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-11/12 max-h-screen border-l-2 border-sketch-border bg-sketch-white font-sketch shadow-sketch-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 font-sketchHeading text-title">
            <TrendingUp size={20} strokeWidth={2.5} className="text-sketch-accent" />
            <span>Resumo financeiro</span>
          </SheetTitle>
        </SheetHeader>
        <div
          style={{
            height: 'calc(100% - 28px)',
          }}
          className="flex flex-col items-center justify-between"
        >
          <div className="mt-6 w-full space-y-8">
            <div className="flex items-center justify-center w-full mx-auto">
              <AnimatedCircularProgressBar
                min={0}
                max={100}
                value={totalProgress}
              />
            </div>

            <div className="grid items-center gap-1">
              <div className="flex items-center text-title">
                <p className="flex-1 text-sm">Itens</p>
                <p className="shrink-0 text-lg font-bold text-title">
                  {totalCheckedItems}
                </p>
              </div>
              <div className="flex items-center text-title">
                <p className="flex-1 text-sm text-paragraph">Valor atual</p>
                <p className="shrink-0 text-lg font-bold text-sketch-accent">
                  {formatCurrency(totalValue || 0)}
                </p>
              </div>
              <div className="flex items-center text-title">
                <p className="flex-1 text-sm text-paragraph">Orçamento</p>
                <p className="shrink-0 text-lg font-bold text-action">
                  {formatCurrency(auxData?.max_value || 0)}
                </p>
              </div>
            </div>
          </div>
          {/* <div className="flex-1 flex flex-col justify-center gap-2">
            {renderPurchaseAlert()}
          </div> */}
          <FinalizePurchaseModal
            onFinalize={handleFinalizePurchase}
            trigger={
              <Button disabled={totalValue <= 0} className="w-full">
                <ShoppingCart />
                <p>Finalizar Compra</p>
              </Button>
            }
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
