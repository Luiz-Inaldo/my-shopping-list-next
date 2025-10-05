import { IPurchaseProps } from "@/types";
import { formatCurrency } from "@/functions/formatCurrency";
import { formatDate } from "@/functions/formatDate";
import { List, Trash2 } from "lucide-react";

interface PurchaseItemProps {
  purchase: IPurchaseProps;
  onViewDetails?: (purchaseId: string) => void;
  onDelete?: (purchaseId: string) => void;
}

export function HistoricPurchaseItem({ purchase, onViewDetails, onDelete }: PurchaseItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      {/* Left Section - Content */}
      <div className="flex-1">
        {/* Top Line - Title with Orange Dot */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full flex-shrink-0" />
          <h3 className="text-gray-800 font-semibold text-base">
            {purchase.title}
          </h3>
        </div>
        
        {/* Bottom Line - Amount and Date */}
        <div className="flex items-center gap-3">
          <span className="text-gray-800 font-bold text-base">
            {formatCurrency(purchase.total_price)}
          </span>
          <div className="w-px h-4 bg-gray-300" />
          <span className="text-gray-500 text-sm">
            {purchase.end_date ? formatDate(purchase.end_date) : 'N/A'}
          </span>
        </div>
      </div>

      {/* Right Section - Action Icons */}
      <div className="flex items-center gap-3 ml-4">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(purchase.id || '')}
            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors duration-200"
            aria-label="Ver detalhes da compra"
          >
            <List size={20} />
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={() => onDelete(purchase.id || '')}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
            aria-label="Excluir compra"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
