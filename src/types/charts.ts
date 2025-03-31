import { IFilterProps, IPurchaseProps } from ".";

export type ChartDataType = {
  dataType: "percentual" | "value";
};
export type StatisticsChartProps = {
  title: string;
  data: IPurchaseProps[];
} & ChartDataType;

export type MonthlyFilterProps = IFilterProps & ChartDataType;
export type AnnualFilterProps = Pick<IFilterProps, "year"> & ChartDataType;
export type AnualStatisticsChartProps = StatisticsChartProps & ChartDataType;

