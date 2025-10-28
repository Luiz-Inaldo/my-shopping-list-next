"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CATEGORIES_LIST } from "@/data/categories";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import React from "react";

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
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
  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.value,
    fill: item.color,
  }));

  return (
    <Card className="bg-app-container border border-border shadow-md rounded-sm">
      <CardHeader>
        <CardTitle className="text-lg text-subtitle font-semibold">
          Gastos por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
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
                      <div className="p-3 rounded-md bg-app-container border border-border shadow-md">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: data.payload?.fill }}
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-subtitle">
                              {data.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-paragraph">
                                Valor: R$ {(data.value as number)?.toFixed(2)}
                              </span>
                              <span className="text-xs text-paragraph">
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
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-paragraph truncate">{item.name}</span>
              <span className="text-subtitle font-medium">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
