"use client";
import { useShoplistContext } from "@/context/ShoplistContext";
import { usePageOverlay } from "@/context/PageOverlayContext";
import { APP_ROUTES } from "@/routes/app-routes";
import Header from "../../../../components/Header";
import { ChevronLeft } from "lucide-react";
import { DetailsCoupon } from "./DetailsCoupon";
import { CategoryDistributionChart } from "./CategoryDistributionChart";
import { CategoryDistributionChartSkeleton } from "./CategoryDistributionChartSkeleton";

export function HistoricListDetails() {
    // ==================
    // # Context
    // ==================
    const {
        listName,
        productsList,
        loadingProductsList
    } = useShoplistContext();

    const { handleChangeRoute } = usePageOverlay();
    return (
        <>
            <Header>
                <ChevronLeft size={20} onClick={() => handleChangeRoute(APP_ROUTES.private.historic.name)} />
                <h2 className="font-medium">{listName}</h2>
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
    )
}
