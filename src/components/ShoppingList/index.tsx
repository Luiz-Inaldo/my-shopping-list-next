'use client';
import Header from '../Header';
import { ChartNoAxesColumnIncreasing, ChevronLeft, Plus } from 'lucide-react';
import { APP_ROUTES } from '@/routes/app-routes';
import { useRouter } from 'next/navigation';
import { FinancialSummary } from './FinancialSummary';
import { ProductsSearch } from './ProductsSearch';
import { CategoryBadgesList } from './CategoryBadgesList';
import { ProductsList } from './ProductsList';
import { useShoplistContext } from '@/context/ShoplistContext';
import { AddProductForm } from '../Forms/AddProductForm';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { LoadingActionModal } from '../Modal/LoadingActionModal';
import PurchaseSaved from './PurchaseSaved';
import { ShoppingListSkeleton } from '../Skeletons/ShoppingListSkeleton';
import useGeneralUserStore from '@/store/generalUserStore';
import { PurchaseBlocked } from '../Errors/PurchaseBlocked';
import ErrorFetchData from '../Errors/ErrorFetchData';
import { FinancialSummarySheet } from '../Sheet/FinancialSummarySheet';
import { sendToastMessage } from '@/functions/sendToastMessage';

export default function ShoppingList() {
  const userId = useGeneralUserStore((store) => store.userProfile?.uid);

  const [isSaved, setIsSaved] = useState(false);
  const [savingModalOpen, setSavingModalOpen] = useState(false);

  const { theme } = useTheme();
  const {
    productsList,
    loadingProductsList,
    pendingProductsList,
    errorFetchingProducts,
  } = useShoplistContext();

  const router = useRouter();

  if (loadingProductsList || pendingProductsList) {
    return <ShoppingListSkeleton />;
  }

  if (errorFetchingProducts) {
    return <ErrorFetchData />;
  }

  if (isSaved) {
    return <PurchaseSaved />;
  }

  if (!productsList?.is_active || userId !== productsList?.user_id) {
    return <PurchaseBlocked />;
  }

  return (
    <div className="sketch-shell page-wrapper relative flex h-screen-dvh flex-col overflow-hidden">
      <Header className="shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <ChevronLeft
            size={20}
            strokeWidth={2.5}
            onClick={() => router.push(APP_ROUTES.private.home.name)}
            className="text-sketch-fg cursor-pointer transition-transform duration-100 hover:-rotate-6 active:scale-95"
          />
          <h2 className="font-sketchHeading text-lg font-bold text-title">
            {productsList?.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <FinancialSummarySheet
            setSavingModalOpen={setSavingModalOpen}
            setIsSaved={setIsSaved}
          />
          <AddProductForm />
        </div>
      </Header>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden pt-4 px-4">
        <div className="flex shrink-0 flex-col gap-4 pb-2">
          <ProductsSearch />
          <CategoryBadgesList />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide pb-4">
          <ProductsList list={productsList?.purchase_items} />
        </div>
      </div>
    </div>
  );
}
