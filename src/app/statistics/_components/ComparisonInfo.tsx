"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { TabType } from "./StatisticsTabs";
import { formatCurrency } from "@/functions/formatCurrency";
import { cn } from "@/lib/utils";

interface ComparisonInfoProps {
  currentValue: number;
  previousValue: number;
  period: TabType;
}

const getPeriodText = (period: TabType) => {

  switch (period) {
    case "day":
      return "o dia";
    case "week":
      return "a semana";
    case "month":
      return "o mês";
    default:
      return "";
  }
}

export function ComparisonInfo({ currentValue, previousValue, period }: ComparisonInfoProps) {

  const difference = currentValue - previousValue;
  const percentageChange = previousValue > 0 ? (difference / previousValue) * 100 : 0;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  if (previousValue === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-paragraph text-center">
          Não há dados suficientes para comparação com {getPeriodText(period)} anterior.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 p-4 mx-4 mb-6 bg-sketch-accent-lt/30 border-2 border-dashed border-sketch-accent/20 rounded-sketch-card font-sketch">
      <div className="flex items-center gap-3">
        {isIncrease && <TrendingUp className="w-6 h-6 text-sketch-danger" strokeWidth={2.5} />}
        {isDecrease && <TrendingDown className="w-6 h-6 text-sketch-success" strokeWidth={2.5} />}
        {!isIncrease && !isDecrease && <div className="w-6 h-6" />}

        <div className="flex flex-col">
          <p className="text-sm text-sketch-fg/60">
            Comparado com {getPeriodText(period)} anterior:
          </p>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-base font-bold underline decoration-wavy underline-offset-4",
              isIncrease ? "text-sketch-danger" : isDecrease ? "text-sketch-success" : "text-sketch-fg/40"
            )}>
              {isIncrease ? "Aumento" : isDecrease ? "Economia" : "Sem alteração"}
            </span>
            <span className="text-lg font-sketchHeading font-bold text-sketch-fg">
              de {formatCurrency(Math.abs(difference))} ({Math.abs(percentageChange).toFixed(1).replace(".", ",")}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
