"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MONTHS } from "@/constants/months";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import React from "react";

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
    <Card className="bg-app-container border border-border shadow-md rounded-sm">
      <CardHeader>
        <CardTitle className="text-lg text-subtitle font-semibold">
          Valor de compras por mês (últimos 6 meses)
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
                  <div className="p-2 rounded-md bg-app-container border border-border shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-7 rounded-full bg-[var(--category-1)]" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-subtitle">
                          {label}
                        </span>
                        <div className="flex items-center gap-10">
                          <span className="text-paragraph">Total: </span>
                          <span className="text-xs text-subtitle font-semibold">
                            R$ {(item.value as number)?.toFixed(2)}
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
