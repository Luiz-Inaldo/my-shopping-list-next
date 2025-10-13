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
import { IProductProps } from "@/types";
import { calculatePercentage } from "@/functions/categoryPercentage";
import { CategoryDistributionChartSkeleton } from "./CategoryDistributionChartSkeleton";

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
    label: "Frios e Laticínios",
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

interface CategoryDistributionChartProps {
  productsList: IProductProps[];
  title?: string;
  loading?: boolean;
}

export function CategoryDistributionChart({ productsList, title = "Distribuição por Categoria", loading = false }: CategoryDistributionChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (productsList && productsList.length > 0) {
      // Gerar dados do gráfico para cada categoria
      const chartData = CATEGORIES.map((category) => {
        // Calcular porcentagem usando a função utilitária
        const percentage = parseFloat(calculatePercentage(productsList, category.name) || '0');

        return {
          category: category.name,
          value: percentage,
          fill: `var(--category-${CATEGORIES.indexOf(category) + 1})`,
        };
      }).filter((item) => item.value > 0); // Filtrar categorias com valor 0

      setChartData(chartData);
    } else {
      setChartData([]);
    }
  }, [productsList]);

  if (loading) {
    return <CategoryDistributionChartSkeleton />;
  }

  return (
    <Card className="bg-app-container shadow-md border rounded-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold text-title">
          {title}
        </CardTitle>
        <CardDescription className="text-paragraph grid gap-1">
          <p>
            Total de itens: <strong>{productsList.length}</strong>
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative p-4">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="!aspect-square h-[220px] mx-auto">
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
                              backgroundColor: `${
                                chartColors.find((color) => color.name === name)
                                  ?.color
                              }`,
                            }}
                          ></div>
                          <span className="text-sm text-paragraph truncate">
                            {name}: {`${Number(value).toFixed(1).replace(".", ",")}%`}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
                wrapperStyle={{ pointerEvents: "auto" }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                innerRadius={60}
                outerRadius={100}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-paragraph text-sm">
            Nenhum produto disponível
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.map((entry, index) => (
            <div key={index} className="col-span-1 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: `${
                    chartColors.find((color) => color.name === entry.category)
                      ?.color
                  }`,
                }}
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
