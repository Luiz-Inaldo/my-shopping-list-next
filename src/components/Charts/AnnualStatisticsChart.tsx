"use client";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CATEGORIES } from "@/constants/categories";
import { useEffect, useState } from "react";

import { AnualStatisticsChartProps } from "@/types/charts";
import { calculateTotalChartValue } from "@/functions/calculateTotalChartValue";

const chartColors = CATEGORIES.map((category) => {
  return {
    name: category.name,
    color: category.backgroundColor,
  };
});

const chartConfig = {
  mercearia: {
    label: "Mercearia",
    color: "var(--category-1)",
  },
  limpeza: {
    label: "Limpeza",
    color: "var(--category-2)",
  },
  frios: {
    label: "Frios e Laticínios",
    color: "var(--category-3)",
  },
  carnes: {
    label: "Carnes e Peixes",
    color: "var(--category-4)",
  },
  padaria: {
    label: "Padaria",
    color: "var(--category-5)",
  },
  higiene: {
    label: "Higiene Pessoal",
    color: "var(--category-6)",
  },
  bebidas: {
    label: "Bebidas",
    color: "var(--category-7)",
  },
  congelados: {
    label: "Congelados",
    color: "var(--category-8)",
  },
  hortifruti: {
    label: "Hortifruti",
    color: "var(--category-9)",
  },
  outros: {
    label: "Outros",
    color: "var(--category-10)",
  },
} satisfies ChartConfig;

export function AnnualStatisticsChart({
  title,
  dataType,
  data,
}: AnualStatisticsChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const chartData = CATEGORIES.map((category, index) => {
        return {
          category: category.name,
          value: calculateTotalChartValue(data, dataType, category.name),
          fill: `var(--color-${category.name.split(" ")[0].toLowerCase()})`,
        };
      });
      setChartData(chartData);
    } else {
      setChartData(data);
    }
  }, [data, dataType]);

  return (
    <Card className="bg-app-container border border-border shadow-md rounded-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold text-subtitle">
          {title}
        </CardTitle>
        <CardDescription className="text-paragraph grid gap-1">
          {/* <p className="text-lg mb-2">{MONTHS[date.month as number]} de {date.year}</p> */}
          <p>
            Total de compras: <strong>{data.length}</strong>
          </p>
          <p>
            Total de gastos:{" "}
            <strong>
              R${" "}
              {data
                .reduce(
                  (total, purchase) =>
                    total + Number(purchase.total_price.replace(",", ".")),
                  0
                )
                .toFixed(2)
                .replace(".", ",")}
            </strong>
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative p-4">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => {
                      return (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{
                              backgroundColor: chartColors.find(
                                (color) => color.name === name
                              )?.color,
                            }}
                          ></div>
                          <span className="text-sm text-paragraph truncate">
                            {name}:{" "}
                            {dataType === "percentual"
                              ? `${String(value).replace(".", ",")}%`
                              : `R$ ${Number(value)
                                  .toFixed(2)
                                  .replace(".", ",")}`}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                innerRadius={0}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-paragraphdark text-sm">
            Nenhum dado disponível
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 top-0 left-5">
          {chartData.map((entry, index) => (
            <div key={index} className="col-span-1 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: chartColors[index].color }}
              ></div>
              <span className="text-sm text-paragraph truncate">
                {entry.category}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
