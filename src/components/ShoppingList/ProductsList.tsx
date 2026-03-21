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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-sketchHeading text-base font-bold text-title">
          Produtos
        </h3>
        <p className="font-sketch text-[13px] text-paragraph">
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
    <div className="flex h-full flex-1 flex-col justify-center gap-4">
      <div className="mx-auto flex flex-col items-center gap-4">
        <Image
          src="/images/fruits.svg"
          alt="imagem das frutas"
          width={64}
          height={64}
          className="mx-auto opacity-50"
        />
        <p className="font-sketch text-center text-[13px] text-paragraph">
          Ainda não há itens na lista
        </p>
        <AddProductForm withLabel className="h-10 px-4" />
      </div>
    </div>
  );
}
