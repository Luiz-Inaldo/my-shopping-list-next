"use client";
import { IPurchaseProps } from "@/types";
import { formatCurrency } from "@/functions/formatCurrency";
import { formatDate } from "@/functions/formatDate";
import { List } from "lucide-react";
import { DeletePurchase } from "@/components/Forms/DeletePurchase";
import { APP_ROUTES } from "@/routes/app-routes";
import Link from "next/link";


interface PurchaseItemProps {
  purchase: IPurchaseProps;
}

export function HistoricPurchaseItem({ purchase }: PurchaseItemProps) {

  return (
    <div className="rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-4 flex items-center justify-between shadow-sketch-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2.5 h-2.5 bg-sketch-success rounded-full flex-shrink-0" />
        </div>

        <div className="space-y-1">
          <h3 className="font-sketch text-subtitle font-medium text-sm">
            {purchase.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className="font-sketch text-subtitle font-medium text-sm">
              {formatCurrency(purchase.total_price)}
            </span>
            <div className="w-px h-4 bg-sketch-border" />
            <span className="font-sketch text-paragraph text-sm">
              {purchase.end_date ? formatDate(purchase.end_date) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <Link
          href={APP_ROUTES.private.historic.details.name(purchase.id as string)}
          className="size-10 p-2 bg-sketch-accent-lt/50 shadow-sketch-sm border-2 rounded-sketch-btn text-sketch-accent transition-colors hover:bg-sketch-accent-lt hover:text-sketch-accent-dk"
          aria-label="Ver detalhes da compra"
        >
          <List size={20} strokeWidth={2.5} />
        </Link>
        <DeletePurchase
          purchase={purchase}
        />
      </div>
    </div>
  );
}
