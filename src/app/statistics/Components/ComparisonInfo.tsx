"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { TabType } from "./StatisticsTabs";

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
    <div className="mt-4 p-3 rounded-lg">
      <div className="flex items-center gap-2">
        {isIncrease && <TrendingUp className="w-4 h-4 text-red-500" />}
        {isDecrease && <TrendingDown className="w-4 h-4 text-green-500" />}
        {!isIncrease && !isDecrease && <div className="w-4 h-4" />}
        
        <div className="flex flex-col">
          <p className="text-sm text-paragraph">
            Comparado com {getPeriodText(period)} anterior:
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${
              isIncrease ? "text-red-500" : isDecrease ? "text-green-500" : "text-gray-500"
            }`}>
              {isIncrease ? "Aumento" : isDecrease ? "Economia" : "Sem alteração"}
            </span>
            <span className="text-sm text-subtitle font-medium">
              de R$ {Math.abs(difference).toFixed(2)} ({Math.abs(percentageChange).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
