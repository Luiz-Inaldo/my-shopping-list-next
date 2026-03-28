import React from 'react';
import { Check, Square } from 'lucide-react';
import { IProductProps } from '@/types';
import { formatCurrency } from '@/functions/formatCurrency';
import { CheckItemForm } from '../Forms/CheckItemForm';
import { useShoplistContext } from '@/context/ShoplistContext';
import { ListItemDropdown } from '../Dropdown/ListItemDropdown';
import { cn } from '@/lib/utils';

export function Product({ item, ...props }: { item: IProductProps }) {
  const { handleCheckItem, handleDismarkItem } = useShoplistContext();

  function handleItemCheckbox(product: IProductProps) {
    if (!product.checked && product.value !== 0) {
      handleCheckItem(product);
    } else if (product.checked) {
      handleDismarkItem(product);
    }
  }

  function renderCheckbox() {
    if (!item.checked && item.value === 0) {
      return <CheckItemForm item={item} />;
    }
    if (!item.checked) {
      return (
        <Square
          onClick={() => handleItemCheckbox(item)}
          size={18}
          strokeWidth={2.5}
          className="cursor-pointer text-sketch-fg opacity-60"
        />
      );
    }
    return (
      <Check
        onClick={() => handleItemCheckbox(item)}
        size={18}
        strokeWidth={2.5}
        className="cursor-pointer text-sketch-success"
      />
    );
  }

  return (
    <div
      {...props}
      className={cn(
        'space-y-2 rounded-sketch-card max-w-[390px] border-2 p-3 font-sketch text-sm shadow-sketch-sm transition-[transform,box-shadow] duration-100 hover:-rotate-0.5 hover:shadow-sketch',
        item.checked
          ? 'border-sketch-accent/20 bg-sketch-accent-lt/50'
          : 'border-sketch-border bg-sketch-white'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {renderCheckbox()}
          <p title={item.name} className={cn("truncate font-bold text-title", item.checked ? 'line-through' : '')}>
            {item.name}
          </p>
        </div>
        <ListItemDropdown item={item} />
      </div>
      <div className="flex items-center justify-between pl-7">
        <div className="flex gap-2 font-sketch text-[13px] text-paragraph">
          <span>
            {String(item.quantity).replace('.', ',')} {item.unit_type}
          </span>
          <span>×</span>
          <span>{formatCurrency(item.value as number)}</span>
        </div>
        <p className="font-sketch text-base font-bold text-sketch-accent">
          {formatCurrency(Number(item.value) * Number(item.quantity))}
        </p>
      </div>
    </div>
  );
}
