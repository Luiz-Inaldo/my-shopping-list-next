'use client';
import { Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CATEGORIES } from '@/constants/categories';
import { useEffect, useState } from 'react';
import { IProductProps } from '@/types';
import { calculatePercentage } from '@/functions/categoryPercentage';
import { CategoryDistributionChartSkeleton } from '../../../../components/Skeletons/CategoryDistributionChartSkeleton';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const chartColors = CATEGORIES.map((category) => {
  return {
    name: category.name,
    color: category.backgroundColor,
  };
});

const chartConfig = {
  mercearia: {
    label: 'Mercearia',
    color: 'var(--category-1)',
  },
  limpeza: {
    label: 'Limpeza',
    color: 'var(--category-2)',
  },
  frios: {
    label: 'Frios e Laticínios',
    color: 'var(--category-3)',
  },
  carnes: {
    label: 'Carnes e Peixes',
    color: 'var(--category-4)',
  },
  padaria: {
    label: 'Padaria',
    color: 'var(--category-5)',
  },
  higiene: {
    label: 'Higiene Pessoal',
    color: 'var(--category-6)',
  },
  bebidas: {
    label: 'Bebidas',
    color: 'var(--category-7)',
  },
  congelados: {
    label: 'Congelados',
    color: 'var(--category-8)',
  },
  hortifruti: {
    label: 'Hortifruti',
    color: 'var(--category-9)',
  },
  outros: {
    label: 'Outros',
    color: 'var(--category-10)',
  },
} satisfies ChartConfig;

interface CategoryDistributionChartProps {
  productsList: IProductProps[];
  title?: string;
  loading?: boolean;
}

export function CategoryDistributionChart({
  productsList,
  title = 'Distribuição por Categoria',
  loading = false,
}: CategoryDistributionChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartExpanded, setChartExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (productsList && productsList.length > 0) {
      // Gerar dados do gráfico para cada categoria
      const chartData = CATEGORIES.map((category) => {
        // Calcular porcentagem usando a função utilitária
        const percentage = parseFloat(
          calculatePercentage(productsList, category.name)
        );

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
    <div className="bg-sketch-white shadow-sketch-sm border-2 border-sketch-fg rounded-sketch-card p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-sketchHeading text-2xl font-bold text-sketch-fg">{title}</h2>
        <button
          type="button"
          className="flex items-center justify-center size-9 shrink-0 rounded-sketch-wobbly border-2 border-sketch-fg bg-sketch-white text-sketch-fg shadow-sketch-sm transition-all duration-100 hover:bg-sketch-accent hover:text-white hover:translate-x-px hover:translate-y-px active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          onClick={() => setChartExpanded(!chartExpanded)}
          aria-label={chartExpanded ? "Recolher gráfico" : "Expandir gráfico"}
        >
          <ChevronDown
            size={20}
            strokeWidth={2.5}
            className={cn(
              'transition-transform duration-300',
              !chartExpanded && 'rotate-180'
            )}
          />
        </button>
      </div>
      <div className={cn("text-sketch-fg/70 font-sketch text-sm mb-4 transition-opacity", !chartExpanded && "opacity-0 hidden")}>
        Total de itens: <strong className="font-bold">{productsList.length}</strong>
      </div>
      <div
        className={cn(
          'relative p-0 transition-all duration-300 ease-in-out',
          !chartExpanded && 'max-h-0 overflow-hidden opacity-0'
        )}
      >
        {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="!aspect-square h-[220px] mx-auto"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="bg-sketch-white border-2 border-sketch-fg shadow-sketch-sm rounded-sketch-card font-sketch"
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
                          <span className="text-sm text-sketch-fg truncate">
                            {name}:{' '}
                            {`${Number(value).toFixed(1).replace('.', ',')}%`}
                          </span>
                        </div>
                      );
                    }}
                  />
                }
                wrapperStyle={{ pointerEvents: 'auto' }}
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
          <p className="text-center text-sketch-fg font-sketch text-sm py-8">
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
              <span className="text-sm text-sketch-fg font-sketch truncate">
                {entry.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
