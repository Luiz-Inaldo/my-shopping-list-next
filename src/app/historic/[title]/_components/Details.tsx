"use client";
import { useShoplistContext } from "@/context/ShoplistContext";
import { usePageOverlay } from "@/context/PageOverlayContext";
import { APP_ROUTES } from "@/routes/app-routes";
import Header from "../../../../components/Header";
import { ChevronLeft } from "lucide-react";
import { DetailsCoupon } from "./DetailsCoupon";

export function HistoricListDetails() {
    // ==================
    // # Context
    // ==================
    const {
        listName,
        productsList
    } = useShoplistContext();

    const { handleChangeRoute } = usePageOverlay();
    return (
        <>
            <Header>
                <ChevronLeft size={20} onClick={() => handleChangeRoute(APP_ROUTES.private.home.name)} />
                <h2 className="font-medium">{listName}</h2>
            </Header>
            <div className="space-y-10 w-full px-5 py-6">
                <div className="bg-app-container p-4 rounded-lg shadow">
                    <p className="text-paragraph text-sm">
                        Nessa área, ficará os gráficos
                        de gastos referentes a compra
                    </p>
                </div>
                <DetailsCoupon />
            </div>
        </>
    )
}
