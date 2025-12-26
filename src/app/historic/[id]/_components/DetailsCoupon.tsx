"use client";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useShoplistContext } from "@/context/ShoplistContext";
import { IProductProps } from "@/types";
import { formatCurrency } from "@/functions/formatCurrency";
import { DetailsCouponSkeleton } from "@/components/Skeletons/DetailsCouponSkeleton";
import { APP_ROUTES } from "@/routes/app-routes";
import { useRouter } from "next/navigation";
import { formatDate } from "@/functions/formatDate";
import useGeneralUserStore from "@/store/generalUserStore";

interface PurchaseItem {
  id: string;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  category: string;
  unitType: string;
}

export function DetailsCoupon() {

  const userProfile = useGeneralUserStore(store => store.userProfile);
  const { productsList, loadingProductsList } = useShoplistContext();
  const router = useRouter();

  // Transformar os produtos da lista em formato de cupom
  const purchaseItems: PurchaseItem[] = productsList?.purchase_items?.map((product: IProductProps, index: number) => ({
    id: product.id || `item-${index}`,
    description: product.name,
    quantity: Number(product.quantity),
    unitValue: Number(product.value),
    totalValue: Number(product.quantity) * Number(product.value),
    category: product.category,
    unitType: product.unit_type
  })) || [];

  // Calcular total da compra
  const totalValue = purchaseItems.reduce((acc, item) => acc + item.totalValue, 0);

  // Obter data da lista de compras
  const endDate = productsList?.end_date ? productsList.end_date.toDate() : new Date();

  const formattedDate = endDate.toLocaleDateString('pt-BR');
  const formattedTime = endDate.toLocaleTimeString('pt-BR');

  function handleGeneratePDF() {
    router.push(APP_ROUTES.private.historic.pdf.name(productsList?.id || ""));
  }

  if (loadingProductsList) {
    return <DetailsCouponSkeleton />;
  }

  return (
    <>
      <div>
        {/* Title with 12px spacing */}
        <h2 className="font-medium text-subtitle mb-3">
          Detalhes da compra
        </h2>

        {/* Receipt Box */}
        <div className="bg-app-container rounded-lg shadow-md p-6 mb-6">
          {/* Store Information */}
          <div className="text-center mb-4">
            <h3 className="font-bold text-title text-lg">
              {productsList?.title}
            </h3>
            <p className="text-subtitle text-sm mt-1">
              Data: {formattedDate} - {formattedTime}
            </p>
          </div>

          {/* Table Headers */}
          <div className="flex gap-1 mb-2 text-xs font-medium text-subtitle py-4 border-t border-b border-slate-400 dark:border-app-border border-dotted">
            <div className="flex-1 text-left"># DESCRIÇÃO</div>
            <div className="text-right">QNTD</div>
            <div className="text-right">VL UNIT</div>
            <div className="text-right">VL TOTAL</div>
          </div>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {purchaseItems.length > 0 ? (
              purchaseItems.map((item, index) => (
                <div key={item.id} className="flex gap-1 text-xs">
                  <div className="flex-1 text-left text-subtitle max-w-[186px] whitespace-break-spaces">
                    {index + 1} - {item.description}
                  </div>
                  <div className="text-right w-[34px] text-subtitle">
                    {item.quantity}
                  </div>
                  <div className="text-right w-[47px] text-subtitle">
                    {formatCurrency(item.unitValue).replace("R$", "")}
                  </div>
                  <div className="text-right w-[56px] text-subtitle">
                    {formatCurrency(item.totalValue).replace("R$", "")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-paragraph text-sm py-4">
                Nenhum item na lista de compras
              </div>
            )}
          </div>

          {/* Total Section */}
          {purchaseItems.length > 0 && (
            <div className="flex justify-between items-center mb-2 py-4 border-t border-b border-slate-400 dark:border-app-border border-dotted">
              <span className="font-bold text-subtitle">TOTAL</span>
              <span className="font-bold text-subtitle text-lg">
                {formatCurrency(totalValue)}
              </span>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-center">
            <p className="text-xs text-paragraph">
              ESSE CUPOM NÃO TEM VALOR FISCAL
            </p>
          </div>
        </div>

        {/* Generate PDF Button */}
        <Button
          onClick={handleGeneratePDF}
          className="w-full"
          disabled={purchaseItems.length === 0 || userProfile?.emailPendencies}
        >
          <FileText size={20} />
          Gerar PDF da compra
        </Button>
      </div>
    </>
  );
}
