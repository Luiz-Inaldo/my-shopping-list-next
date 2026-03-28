"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MONTHS } from "@/constants/months";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import React from "react";
import { formatCurrency } from "@/functions/formatCurrency";

interface MonthlyData {
  month: string;
  value: number;
}

interface LastSixMonthsAreaChartProps {
  data: MonthlyData[];
}

const chartConfig = {
  value: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig;

export function LastSixMonthsAreaChart({ data }: LastSixMonthsAreaChartProps) {
  return (
    <Card className="shadow-sketch">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Total de compras (últimos 6 meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 20,
              right: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor
              content={({ label, payload }) => {
                const item = payload?.[0];
                if (!item) return null;

                return (
                  <div className="p-3 rounded-sketch-card bg-sketch-bg border-2 border-sketch-fg shadow-sketch-sm font-sketch">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full bg-[var(--category-1)] shadow-sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-sketch-fg">
                          {label}
                        </span>
                        <div className="flex items-center gap-8">
                          <span className="text-sm text-sketch-fg/60">Total: </span>
                          <span className="text-sm text-sketch-accent font-bold">
                            {formatCurrency(item.value as number)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Area
              dataKey="value"
              type="linear"
              fill="var(--category-1)"
              fillOpacity={0.4}
              stroke="var(--category-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
