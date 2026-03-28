"use client";

import { FileText } from "lucide-react";
import { useShoplistContext } from "@/context/ShoplistContext";
import { IProductProps } from "@/types";
import { formatCurrency } from "@/functions/formatCurrency";
import { DetailsCouponSkeleton } from "@/components/Skeletons/DetailsCouponSkeleton";
import { APP_ROUTES } from "@/routes/app-routes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
        <h2 className="font-sketchHeading text-2xl font-bold text-sketch-fg mb-4">
          Detalhes da compra
        </h2>

        {/* Receipt Box */}
        <div className="bg-sketch-white border-2 border-sketch-fg rounded-sketch-card shadow-sketch p-6 mb-8 relative overflow-hidden">
          {/* Store Information */}
          <div className="text-center mb-6">
            <h3 className="font-sketchHeading text-2xl font-bold text-sketch-fg">
              {productsList?.title}
            </h3>
            <p className="font-sketch text-sketch-fg/60 text-sm mt-1">
              Data: {formattedDate} - {formattedTime}
            </p>
          </div>

          {/* Table Headers */}
          <div className="flex gap-1 mb-3 text-[10px] font-bold text-sketch-fg/80 py-4 border-t-2 border-b-2 border-sketch-fg/20 border-dashed font-sketch">
            <div className="flex-1 text-left"># DESCRIÇÃO</div>
            <div className="text-right w-[34px]">QNTD</div>
            <div className="text-right w-[47px]">VL UNIT</div>
            <div className="text-right w-[56px]">VL TOTAL</div>
          </div>

          {/* Items List */}
          <div className="space-y-2 mb-4">
            {purchaseItems.length > 0 ? (
              purchaseItems.map((item, index) => (
                <div key={item.id} className="flex gap-1 text-[10px] font-sketch text-sketch-fg">
                  <div className="flex-1 text-left max-w-[186px] whitespace-break-spaces">
                    {index + 1} - {item.description}
                  </div>
                  <div className="text-right w-[34px]">
                    {item.quantity}
                  </div>
                  <div className="text-right w-[47px]">
                    {formatCurrency(item.unitValue).replace("R$", "")}
                  </div>
                  <div className="text-right w-[56px]">
                    {formatCurrency(item.totalValue).replace("R$", "")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sketch-fg/60 font-sketch text-sm py-4">
                Nenhum item na lista de compras
              </div>
            )}
          </div>

          {/* Total Section */}
          {purchaseItems.length > 0 && (
            <div className="flex justify-between items-center mb-4 py-4 border-t-2 border-b-2 border-sketch-fg/20 border-dashed">
              <span className="font-sketchHeading text-lg font-bold text-sketch-fg">TOTAL</span>
              <span className="font-sketchHeading text-2xl font-bold text-sketch-accent">
                {formatCurrency(totalValue)}
              </span>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-center">
            <p className="text-[10px] text-sketch-fg/40 font-sketch tracking-widest">
              -- ESSE CUPOM NÃO TEM VALOR FISCAL --
            </p>
          </div>
        </div>

        {/* Generate PDF Button */}
        <Button
          onClick={handleGeneratePDF}
          className="w-full h-12 text-xl gap-3 rounded-sketch-wobbly border-[3px] shadow-sketch"
          disabled={purchaseItems.length === 0}
        >
          <FileText size={22} strokeWidth={2.5} />
          Gerar PDF da compra
        </Button>
      </div>
    </>
  );
}
