"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MONTHS } from "@/constants/months";
import { YEARS } from "@/constants/years";
import React from "react";

interface MonthYearFiltersProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function MonthYearFilters({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange 
}: MonthYearFiltersProps) {
  return (
    <div className="flex gap-3 pt-6 pb-1 px-4">
      <div className="flex-1">
        <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
