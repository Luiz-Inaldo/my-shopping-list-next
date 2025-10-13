"use client"
import Header from '../Header';
import { ChevronLeft } from 'lucide-react';
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

export default function ShoppingList() {

  const userId = useGeneralUserStore(store => store.userProfile?.uid)

  const [isSaved, setIsSaved] = useState(false);
  const [savingModalOpen, setSavingModalOpen] = useState(false);

  const { theme } = useTheme();
  const { productsList, loadingProductsList, pendingProductsList, errorFetchingProducts } = useShoplistContext();

  const { handleChangeRoute } = usePageOverlay();

  if (loadingProductsList || pendingProductsList) {
    return <ShoppingListSkeleton />;
  }

  if (errorFetchingProducts) {
    return <ErrorFetchData />;
  }

  if (!productsList?.is_active || userId !== productsList?.user_id) {
    return <PurchaseBlocked />;
  }

  return (
    <div className="relative space-y-0 min-h-screen">
      {!isSaved ? (
        <>
          <Header>
            <ChevronLeft size={20} onClick={() => handleChangeRoute(APP_ROUTES.private.home.name)} />
            <h2 className="font-medium">{productsList?.title}</h2>
          </Header>
          <div className="p-4 w-full flex flex-col gap-5">
            <FinancialSummary
              setSavingModalOpen={setSavingModalOpen}
              setIsSaved={setIsSaved}
            />
            <ProductsSearch />
            <CategoryBadgesList />
            <ProductsList list={productsList?.purchase_items} />
          </div>
          <AddProductForm />
        </>
      ) : (
        <PurchaseSaved />
      )}
      {savingModalOpen && (
        <LoadingActionModal
          text="Finalizando sua compra..."
        />
      )}
    </div>
  )
}
