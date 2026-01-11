'use client';
import { useShoplistContext } from '@/context/ShoplistContext';
import { usePageOverlay } from '@/context/PageOverlayContext';
import { APP_ROUTES } from '@/routes/app-routes';
import Header from '../../../../components/Header';
import { ChevronLeft, FileDown } from 'lucide-react';
import { DetailsCoupon } from './DetailsCoupon';
import { CategoryDistributionChart } from './CategoryDistributionChart';
import { Button } from '@/components/ui/button';
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
      <Header className="justify-between">
        <div className="flex items-center gap-4">
          <Link href={APP_ROUTES.private.historic.name}>
            <ChevronLeft
              size={20}
            />
          </Link>
          <h2 className="font-medium">
            {productsList?.title || 'Carregando...'}
          </h2>
        </div>
        <Button
          title="Baixar Relatório PDF"
          variant="ghost"
          onClick={handleGeneratePDF}
          className="size-7 rounded-xl"
        >
          <FileDown size={20} />
        </Button>
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
