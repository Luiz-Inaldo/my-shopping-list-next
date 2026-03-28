"use client";

import { formatCurrency } from "@/functions/formatCurrency";
import React from "react";
import { SmoothTapeEffect } from "@/components/Effects/SmoothTapeEffect";

interface SummaryInfoProps {
  totalPurchases: number;
  totalValue: number;
}

export function SummaryInfo({ totalPurchases, totalValue }: SummaryInfoProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-6 px-4 pb-6 font-sketch">
      <div className="relative p-4 bg-sketch-bg border-2 border-sketch-fg rounded-sketch-wobbly text-center shadow-sketch-sm">
        <SmoothTapeEffect className="-rotate-1" />
        <p className="text-sm text-sketch-fg/60 uppercase tracking-tight font-bold">Total de Compras</p>
        <p className="text-2xl font-sketchHeading font-bold text-sketch-fg">{totalPurchases}</p>
      </div>
      <div className="relative p-4 bg-sketch-bg border-2 border-sketch-fg rounded-sketch-wobbly text-center shadow-sketch-sm">
        <SmoothTapeEffect className="rotate-2" />
        <p className="text-sm text-sketch-fg/60 uppercase tracking-tight font-bold">Valor Total</p>
        <p className="text-2xl font-sketchHeading font-bold text-sketch-accent">
          {formatCurrency(totalValue)}
        </p>
      </div>
    </div>
  );
}
