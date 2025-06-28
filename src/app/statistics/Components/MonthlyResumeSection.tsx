import { MonthlyStatisticsChart } from '@/components/Charts/MonthlyStatisticsChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MONTHS } from '@/constants/months';
import { YEARS } from '@/constants/years';
import { PurchasesContext } from '@/context/PurchasesContext';
import { IFilterProps, IPurchaseProps } from '@/types';
import { MonthlyFilterProps } from '@/types/charts';
import React, { useContext, useEffect, useState } from 'react'

export const MonthlyResumeSection = () => {

    const { purchasesList } = useContext(PurchasesContext);

    const [data, setData] = useState<IPurchaseProps[]>([]);
    const [filterStates, setFilterStates] = useState<MonthlyFilterProps>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        dataType: 'percentual'
    });
    const [filterLock, setFilterLock] = useState(true);

    // functions
    const filterPurchases = async (filter: IFilterProps) => {

        const month = Number(filter.month);
        const year = Number(filter.year);

        const filteredData = purchasesList.filter(purchase =>
            purchase.purchase_date.split("T")[0].split("-")[0] === year.toString() &&
            purchase.purchase_date.split("T")[0].split("-")[1] === String(month + 1).padStart(2, '0')
        );

        setData(filteredData);
    }

    useEffect(() => {
        if (!filterLock) {
            filterPurchases(filterStates);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStates, filterLock]);

    useEffect(() => {
        if (purchasesList.length > 0 && filterLock) {
            setFilterLock(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchasesList]);

    return (
      <section className="grid gap-5">
        <div>
          <p className="text-subtitle font-bold mb-3">Resumo mensal:</p>
          <div className="p-4 bg-app-container shadow-md border border-border rounded-sm">
            <p className="text-subtitle mb-5">Filtrar por:</p>
            <div className="flex items-center gap-3 mb-3">
              <Select
                defaultValue={filterStates.month.toString()}
                onValueChange={(value) => {
                    setFilterStates((prev) => ({
                      ...prev,
                      month: Number(value),
                    }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={month} value={String(index)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-subtitle">de</p>
              <Select
                defaultValue={filterStates.year.toString()}
                onValueChange={(value) => {
                    setFilterStates((prev) => ({
                      ...prev,
                      year: Number(value),
                    }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <hr className="border-border mb-3" />
            <div className="flex items-center gap-3">
              <p className="text-subtitle flex-1 w-full">
                Tipo de visualização:
              </p>
              <Select
                defaultValue={filterStates.dataType}
                onValueChange={(value) => {
                    setFilterStates((prev) => ({
                      ...prev,
                      dataType: value as MonthlyFilterProps["dataType"],
                    }));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentual">Porcentagem</SelectItem>
                  <SelectItem value="value">Valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <MonthlyStatisticsChart
          title={
            filterStates.dataType === "percentual"
              ? "Resumo por Categoria (%)"
              : "Resumo por Categoria (R$)"
          }
          dataType={filterStates.dataType}
          data={filterLock ? [] : data}
        />
      </section>
    );
}
