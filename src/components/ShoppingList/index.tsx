"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../Header';
import { ChevronLeft } from 'lucide-react';
import { APP_ROUTES } from '@/routes/app-routes';
import { usePageOverlay } from '@/context/PageOverlayContext';
import { FinancialSummary } from './FinancialSummary';
import { ProductsSearch } from './ProductsSearch';
import { CategoryBadgesList } from './CategoryBadgesList';
import { ProductsList } from './ProductsList';

export default function ShoppingList() {

  const searchParams = useSearchParams();
  const { handleChangeRoute } = usePageOverlay();

  return (
    <div className="space-y-5">
      <Header>
        <ChevronLeft size={20} onClick={() => handleChangeRoute(APP_ROUTES.private.home.name)}/>
        <h2 className="font-medium">{searchParams.get("name")}</h2>
      </Header>
      <div className="p-4 w-full flex flex-col gap-5">
        <FinancialSummary />
        <ProductsSearch />
        <CategoryBadgesList />
        <ProductsList />
      </div>
    </div>
  )
}
