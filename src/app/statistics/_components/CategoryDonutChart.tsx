"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import React from "react";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryDonutChartProps {
  data: CategoryData[];
  totalValue: number;
}

const chartConfig = {
  value: {
    label: "Valor",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CategoryDonutChart({ data, totalValue }: CategoryDonutChartProps) {

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.value,
    fill: item.color,
  }));

  return (
    <Card className="!shadow-none !border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Gastos por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 items-start shadow-none border-none">
        {chartData.length > 0 ? (
          <ChartContainer className="h-[220px] !aspect-square w-full flex-1" config={chartConfig}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={chartData.length > 1 ? 2 : 0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const categoryData = chartData.find(item => item.name === data.name);
                    const percentage = categoryData ?
                      ((data.value as number) / totalValue * 100).toFixed(1) : '0';

                    return (
                      <div className="p-3 rounded-sketch-card bg-sketch-bg border-2 border-sketch-fg shadow-sketch-sm font-sketch">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-sketch-fg/20"
                            style={{ backgroundColor: data.payload?.fill }}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-sketch-fg">
                              {data.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-sketch-fg/60">
                                Valor: R$ {(data.value as number)?.toFixed(2)}
                              </span>
                              <span className="text-xs text-sketch-fg/60 font-bold">
                                ({percentage}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-center w-full text-paragraph text-sm">
            Não há dados disponíveis para exibição
          </p>
        )}

        {/* Legend */}
        {chartData.length > 0 && (
          <div className="shrink-0 flex-1 grid gap-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-paragraph truncate">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
