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

export default function ShoppingList() {

  const { theme } = useTheme();
  const { listName, productsList } = useShoplistContext();

  const { handleChangeRoute } = usePageOverlay();

  return (
    <div className="relative space-y-0 min-h-screen">
      <Header>
        <ChevronLeft size={20} onClick={() => handleChangeRoute(APP_ROUTES.private.home.name)} />
        <h2 className="font-medium">{listName}</h2>
      </Header>
      <div className="p-4 w-full flex flex-col gap-5">
        <FinancialSummary />
        <ProductsSearch />
        <CategoryBadgesList />
        <ProductsList list={productsList?.purchase_items} />
      </div>
      <AddProductForm />
    </div>
  )
}
