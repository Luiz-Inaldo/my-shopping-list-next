import React, { useMemo } from 'react';
import { Product } from './Product';
import Image from 'next/image';
import { IProductProps } from '@/types';
import { AddProductForm } from '../Forms/AddProductForm';

export function ProductsList({
  list,
}: {
  list: IProductProps[] | null | undefined;
}) {
  const totalCheckedItems = list?.filter(
    (product) => product.checked === true
  ).length;
  const totalListItems = list?.length ?? 0;

  const sortedList = useMemo(() => {
    return list?.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, [list]);

  if (!list || totalListItems === 0) return <EmptyProducsList />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-subtitle text-sm font-medium">Produtos</h3>
        <p className="text-paragraph text-xs">
          {totalCheckedItems}/{totalListItems} itens marcados
        </p>
      </div>

      <div className="space-y-3">
        {sortedList?.map((product) => (
          <Product key={product.name} item={product} />
        ))}
      </div>
    </div>
  );
}

function EmptyProducsList() {
  return (
    <div className="flex-1 flex flex-col justify-center gap-2 h-full">
      <div className="space-y-5 mx-auto">
        <Image
          src="/images/fruits.svg"
          alt="imagem das frutas"
          width={64}
          height={64}
          className="opacity-50 mx-auto"
        />
        <p className="text-paragraph text-center text-xs">
          Ainda não há itens na lista
        </p>
        <AddProductForm withLabel className="px-3 h-10"/>
      </div>
    </div>
  );
}
