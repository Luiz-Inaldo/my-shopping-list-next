"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { IPurchaseProps } from "@/types"
import { MONTHS } from "@/constants/months"
const chartData = [
    { month: "January", value: 186 },
    { month: "February", value: 305 },
    { month: "March", value: 237 },
    { month: "April", value: 73 },
    { month: "May", value: 209 },
    { month: "June", value: 214 },
]

const chartConfig = {
    value: {
        label: "Total",
        color: "hsl(var(--chart-1))",
    }
} satisfies ChartConfig

export function LastSixMonthsChart({ data }: { data: IPurchaseProps[] }) {

    const [chartData, setChartData] = useState<any[]>([]);

    function calculateTotalMonthValue(data: any[], month: string) {
        let total = 0;
        total = data.reduce((acc, purchase) => {
            if (purchase.purchase_date.split("T")[0].split("-")[1] === month) {
                return acc += Number(purchase.total_price.replace(',', '.'))
            } else {
                return acc;
            }
        }, 0)

        return total
    }

    // effects
    useEffect(() => {
        if (data && data.length > 0) {
            const allMonths = data.map((purchase) => {
                return purchase.purchase_date.split("T")[0].split("-")[1]
            });

            const uniqueMonths: string[] = Array.from(new Set(allMonths));

            const chartData = uniqueMonths.map((month) => {
                return {
                    month: MONTHS[Number(month) - 1],
                    value: calculateTotalMonthValue(data, month)
                }
            });
            setChartData(chartData)
        }
    }, [data]);

    return (
      <Card className="bg-app-container border border-border shadow-md rounded-sm">
        <CardHeader>
          <CardTitle className="text-lg text-subtitle font-semibold">
            Valor de compras por mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
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
                              R$ {item.value}
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
        {data && data.length > 0 && (
          <CardFooter>
            <p className="text-paragraph text-sm">
              {"Período de: "}
              <b>
                {MONTHS[
                  Number(data[0].purchase_date.split("T")[0].split("-")[1] - 1)
                ].slice(0, 3)}
                -{data[0].purchase_date.split("T")[0].split("-")[0]}
                {" a "}
                {MONTHS[
                  Number(
                    data[data.length - 1].purchase_date
                      .split("T")[0]
                      .split("-")[1] - 1
                  )
                ].slice(0, 3)}
                -
                {
                  data[data.length - 1].purchase_date
                    .split("T")[0]
                    .split("-")[0]
                }
              </b>
            </p>
          </CardFooter>
        )}
      </Card>
    );
}
