"use client";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PurchaseItem {
  id: number;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

interface PurchaseData {
  storeName: string;
  date: string;
  time: string;
  items: PurchaseItem[];
  total: number;
}

const mockPurchaseData: PurchaseData = {
  storeName: "ASSAÍ ATACADISTA - BOA VIAGEM",
  date: "20/10/2024",
  time: "19:52:52",
  items: [
    {
      id: 1,
      description: "ABSORVENTE AWAYS 8UN",
      quantity: 3,
      unitValue: 1.89,
      totalValue: 5.67
    },
    {
      id: 2,
      description: "MACARRÃO ESPAGUETE VITARELL A 400G",
      quantity: 15,
      unitValue: 2.00,
      totalValue: 30.00
    },
    {
      id: 3,
      description: "BISCOITO TRELOSO CHOCOLATE 180G",
      quantity: 5,
      unitValue: 1.75,
      totalValue: 8.75
    },
    {
      id: 4,
      description: "PEITO DE FRANGO AURORA BDJ 1KG",
      quantity: 4,
      unitValue: 22.00,
      totalValue: 88.00
    },
    {
      id: 5,
      description: "QUEIJO PARM RALADO PAMPULH A 50G",
      quantity: 2,
      unitValue: 3.49,
      totalValue: 6.98
    },
    {
      id: 6,
      description: "SALGADINHO CHEETOS REQUEIJÃO 28G",
      quantity: 10,
      unitValue: 0.99,
      totalValue: 9.90
    }
  ],
  total: 125.98
};

function formatCurrency(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function DetailsCoupon() {
  const handleGeneratePDF = () => {
    // TODO: Implement PDF generation
  };

  return (
    <div>
      {/* Title with 12px spacing */}
      <h2 className="font-medium text-subtitle mb-3">
        Detalhes da compra
      </h2>
      
      {/* Receipt Box */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Store Information */}
        <div className="text-center mb-4">
          <h3 className="font-bold text-black text-lg">
            {mockPurchaseData.storeName}
          </h3>
          <p className="text-black text-sm mt-1">
            Data: {mockPurchaseData.date} - {mockPurchaseData.time}
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
          {mockPurchaseData.items.map((item) => (
            <div key={item.id} className="flex gap-1 text-xs">
              <div className="flex-1 text-left text-subtitle max-w-[186px] whitespace-break-spaces">
                {item.id} - {item.description}
              </div>
              <div className="text-right w-[34px] text-subtitle">
                {item.quantity}
              </div>
              <div className="text-right w-[47px] text-subtitle">
                {formatCurrency(item.unitValue)}
              </div>
              <div className="text-right w-[56px] text-subtitle">
                {formatCurrency(item.totalValue)}
              </div>
            </div>
          ))}
        </div>

        {/* Total Section */}
        <div className="flex justify-between items-center mb-2 py-4 border-t border-b border-slate-400 dark:border-app-border border-dotted">
          <span className="font-bold text-subtitle">TOTAL</span>
          <span className="font-bold text-subtitle text-lg">
            {formatCurrency(mockPurchaseData.total)}
          </span>
        </div>

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
      >
        <FileText size={20} />
        Gerar PDF da compra
      </Button>
    </div>
  );
}
