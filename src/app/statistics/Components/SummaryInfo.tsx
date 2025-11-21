"use client";

import React from "react";

interface SummaryInfoProps {
  totalPurchases: number;
  totalValue: number;
}

export function SummaryInfo({ totalPurchases, totalValue }: SummaryInfoProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 px-4 pb-4">
      <div className="p-3 bg-app-background rounded-lg text-center">
        <p className="text-sm text-paragraph">Total de Compras</p>
        <p className="text-lg font-semibold text-subtitle">{totalPurchases}</p>
      </div>
      <div className="p-3 bg-app-background rounded-lg text-center">
        <p className="text-sm text-paragraph">Valor Total</p>
        <p className="text-lg font-semibold text-subtitle">
          R$ {totalValue.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
