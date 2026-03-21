import { IPurchaseProps } from '@/types';
import { HistoricPurchaseItemSkeleton } from './HistoricPurchaseItemSkeleton';
import React, { useMemo } from 'react';
import { HistoricPurchaseItem } from './HistoricPurchaseItem';
import ErrorFetchData from '@/components/Errors/ErrorFetchData';

interface THistoricListProps {
  isLoading: boolean;
  hasError: boolean;
  data: IPurchaseProps[] | undefined;
  retryFn: () => void;
  isFetching: boolean;
}

export function HistoricList({
  isLoading,
  hasError,
  data,
  retryFn,
  isFetching,
}: THistoricListProps) {
  const sortedList = useMemo(() => {
    if (!data) return [];
    return data.sort((a, b) => {
      return b.end_date!.toDate().getTime() - a.end_date!.toDate().getTime();
    });
  }, [data]);

  if (isLoading || !sortedList) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <HistoricPurchaseItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (hasError) {
    return <ErrorFetchData retryFn={retryFn} isRetrying={isFetching} />;
  }

  if (sortedList.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 mt-10">
        <h2 className="text-4xl font-bold font-sketchHeading text-sketch-accent">;D</h2>
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-medium font-sketch text-title">Nada aqui ainda!</h3>
          <p className="text-center font-sketch text-paragraph text-sm">
            você não possui compras registradas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="font-sketch text-paragraph text-sm">
        Exibindo {sortedList.length}{' '}
        {sortedList.length === 1 ? 'resultado' : 'resultados'}
      </p>
      <div className="space-y-3">
        {sortedList.map((purchase) => (
          <HistoricPurchaseItem key={purchase.id} purchase={purchase} />
        ))}
      </div>
    </div>
  );
}
