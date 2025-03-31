"use client"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CATEGORIES } from "@/constants/categories"
import { IProductProps, IPurchaseProps } from "@/types"
import { useEffect, useState } from "react"

import { AnualStatisticsChartProps, StatisticsChartProps } from "@/types/charts"
import { calculatePercentage } from "@/functions/categoryPercentage"
import { calculateTotalChartValue } from "@/functions/calculateTotalChartValue"

const chartColors = CATEGORIES.map((category) => {
  return {
    name: category.name,
    color: category.color
  }
})

const chartConfig = {
  mercearia: {
    label: "Mercearia",
    color: "#4CAF50"
  },
  limpeza: {
    label: "Limpeza",
    color: "#44a1ec"
  },
  frios: {
    label: "Frios e Laticínios",
    color: "#ffdaa0"
  },
  carnes: {
    label: "Carnes e Peixes",
    color: "#f37066"
  },
  padaria: {
    label: "Padaria",
    color: "#ffd557"
  },
  higiene: {
    label: "Higiene Pessoal",
    color: "#E1B7E0"
  },
  bebidas: {
    label: "Bebidas",
    color: "#88d1df"
  },
  congelados: {
    label: "Congelados",
    color: "#A3C6E5"
  },
  hortifruti: {
    label: "Hortifruti",
    color: "#93e393"
  },
  outros: {
    label: "Outros",
    color: "#D3D3D3"
  }
} satisfies ChartConfig

export function AnnualStatisticsChart({ title, dataType, data }: AnualStatisticsChartProps) {

  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (data && data.length > 0) {
      const chartData = CATEGORIES.map((category, index) => {

        return {
          category: category.name,
          value: calculateTotalChartValue(data, dataType, category.name),
          fill: `var(--color-${category.name.split(" ")[0].toLowerCase()})`
        }
      })
      setChartData(chartData)
    } else {
      setChartData(data)
    }
  }, [data, dataType])

  return (
    <Card className="bg-secondary-dark border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-titledark">{title}</CardTitle>
        <CardDescription className="text-subtitledark grid gap-1">
          {/* <p className="text-lg mb-2">{MONTHS[date.month as number]} de {date.year}</p> */}
          <p>Total de compras: <strong>{data.length}</strong></p>
          <p>
            Total de gastos: <strong>R$ {data.reduce((total, purchase) => total + Number(purchase.total_price.replace(',', '.')), 0).toFixed(2).replace('.', ',')}</strong>
            </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel formatter={(value, name) => {
                  return (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors.find((color) => color.name === name)?.color }}></div>
                      <span className="text-sm text-linkdark truncate">{name}: {dataType === 'percentual' ? `${String(value).replace('.', ',')}%` : `R$ ${Number(value).toFixed(2).replace('.', ',')}`}</span>
                    </div>
                  )
                }} />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                innerRadius={50}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-paragraphdark text-sm">Nenhum dado disponível</p>
        )}
        <div className="mt-4 grid grid-cols-2 top-0 left-5">
          {chartData.map((entry, index) => (
            <div key={index} className="col-span-1 flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors[index].color }}></div>
              <span className="text-sm text-white truncate">{entry.category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
