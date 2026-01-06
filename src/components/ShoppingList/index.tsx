'use client';
import Header from '../Header';
import { ChartNoAxesColumnIncreasing, ChevronLeft, Plus } from 'lucide-react';
import { APP_ROUTES } from '@/routes/app-routes';
import { usePageOverlay } from '@/context/PageOverlayContext';
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

  const { handleChangeRoute } = usePageOverlay();

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
    <div className="page-wrapper relative flex flex-col h-screen">
      <Header className="justify-between">
        <div className="flex items-center gap-2">
          <ChevronLeft
            size={20}
            onClick={() => handleChangeRoute(APP_ROUTES.private.home.name)}
            className="text-subtitle cursor-pointer"
          />
          <h2 className="font-medium text-subtitle">{productsList?.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <FinancialSummarySheet
            setSavingModalOpen={setSavingModalOpen}
            setIsSaved={setIsSaved}
          />
          <AddProductForm />
        </div>
      </Header>
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        <div className="p-4 pb-0 flex flex-col gap-4 shrink-0">
          <ProductsSearch />
          <CategoryBadgesList />
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ProductsList list={productsList?.purchase_items} />
        </div>
      </div>

      {/* {savingModalOpen && (
        <LoadingActionModal text="Finalizando sua compra..." />
      )} */}
    </div>
  );
}
