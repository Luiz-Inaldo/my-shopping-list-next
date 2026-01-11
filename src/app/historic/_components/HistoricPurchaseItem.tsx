"use client";
import { IPurchaseProps } from "@/types";
import { formatCurrency } from "@/functions/formatCurrency";
import { formatDate } from "@/functions/formatDate";
import { List, Trash2 } from "lucide-react";
import { DeletePurchase } from "@/components/Forms/DeletePurchase";
import { APP_ROUTES } from "@/routes/app-routes";
import Link from "next/link";
import useGeneralUserStore from "@/store/generalUserStore";

interface PurchaseItemProps {
  purchase: IPurchaseProps;
}

export function HistoricPurchaseItem({ purchase }: PurchaseItemProps) {

  return (
    <div className="bg-app-container rounded-lg shadow-sm border border-app-border p-4 flex items-center justify-between">
      {/* Left Section - Content */}
      <div className="flex items-center gap-3">
        {/* Top Line - Title with Orange Dot */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2.5 h-2.5 bg-app-secondary rounded-full flex-shrink-0" />
        </div>

        {/* Bottom Line - Amount and Date */}
        <div className="space-y-1">
          <h3 className="text-subtitle font-medium text-sm">
            {purchase.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-subtitle font-medium text-sm">
              {formatCurrency(purchase.total_price)}
            </span>
            <div className="w-px h-4 bg-app-border" />
            <span className="text-paragraph text-sm">
              {purchase.end_date ? formatDate(purchase.end_date) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section - Action Icons */}
      <div className="flex items-center gap-3 ml-4">
        <Link
          href={APP_ROUTES.private.historic.details.name(purchase.id as string)}
          className="text-app-primary"
          aria-label="Ver detalhes da compra"
        >
          <List size={20} />
        </Link>
        <DeletePurchase
          purchase={purchase}
          trigger={
            <button
              className="text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Excluir compra"
            >
              <Trash2 size={20} />
            </button>
          } />

      </div>
    </div>
  );
}
