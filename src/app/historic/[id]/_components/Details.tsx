'use client';
import { useShoplistContext } from '@/context/ShoplistContext';
import { APP_ROUTES } from '@/routes/app-routes';
import Header from '../../../../components/Header';
import { ChevronLeft, FileDown } from 'lucide-react';
import { DetailsCoupon } from './DetailsCoupon';
import { CategoryDistributionChart } from './CategoryDistributionChart';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function HistoricListDetails() {
  // ==================
  // # Context
  // ==================
  const { productsList, loadingProductsList } = useShoplistContext();

  const router = useRouter();

  function handleGeneratePDF() {
    router.push(APP_ROUTES.private.historic.pdf.name(productsList?.id || ''));
  }

  return (
    <>
      <Header className="justify-between px-4 py-2 min-h-[72px]">
        <div className="flex items-center gap-4">
          <Link
            href={APP_ROUTES.private.historic.name}
            className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-sketch-fg bg-sketch-white text-sketch-fg shadow-sketch rounded-sketch-wobbly transition-all duration-100 hover:bg-sketch-accent hover:text-white hover:shadow-sketch-sm hover:translate-x-px hover:translate-y-px active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            aria-label="Voltar para o histórico"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </Link>
          <h2 className="font-sketchHeading text-2xl font-bold text-sketch-fg truncate max-w-[200px] md:max-w-md">
            {productsList?.title || 'Carregando...'}
          </h2>
        </div>
        <button
          type="button"
          title="Baixar Relatório PDF"
          onClick={handleGeneratePDF}
          className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-sketch-fg bg-sketch-white text-sketch-fg shadow-sketch rounded-sketch-wobbly transition-all duration-100 hover:bg-sketch-accent hover:text-white hover:shadow-sketch-sm hover:translate-x-px hover:translate-y-px active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          <FileDown size={20} strokeWidth={2.5} />
        </button>
      </Header>
      <div className="space-y-10 w-full px-5 py-6">
        <CategoryDistributionChart
          loading={loadingProductsList}
          productsList={productsList?.purchase_items || []}
          title="Distribuição por Categoria"
        />
        <DetailsCoupon />
      </div>
    </>
  );
}
