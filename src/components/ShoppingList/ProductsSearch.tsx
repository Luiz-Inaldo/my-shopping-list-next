import React, { useMemo } from 'react'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { debounce } from '@/functions/debounce'
import { useShoplistContext } from '@/context/ShoplistContext'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { IPurchaseProps } from '@/types'

export function ProductsSearch() {

  const { auxData, productsList, setFilterValue } = useShoplistContext();
  const queryClient = useQueryClient();

  const debouncedQuery = useMemo(() => {
    return debounce((value: string) => {

      const searchValue = value.toLowerCase();
      
      if (!searchValue) {
        queryClient.setQueryData([QUERY_KEYS.productsList, productsList?.id], auxData);
        setFilterValue(null);
        return;
      }

      const filteredList = auxData?.purchase_items?.filter(product => product.name.toLowerCase().includes(searchValue)) ?? [];

      queryClient.setQueryData([QUERY_KEYS.productsList, productsList?.id], (oldList: IPurchaseProps | undefined) => ({
        ...oldList!,
        purchase_items: filteredList
      }));
      setFilterValue(searchValue);
    }, 1000);
    //eslint-disable-next-line
  }, []);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    debouncedQuery(value);
  }

  if (!auxData?.purchase_items?.length) return null;

  return (
    <div className="relative">
      <Search
        size={16}
        strokeWidth={2.5}
        className="text-sketch-fg absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
      />
      <Input
        type="text"
        placeholder="Buscar por produto..."
        onChange={handleFilter}
        className="h-10 w-full border-2 border-sketch-border bg-sketch-white pl-9 font-sketch text-sm text-title shadow-sketch-sm placeholder:text-title/40 focus-visible:ring-2 focus-visible:ring-sketch-accent/25 focus-visible:ring-offset-0 rounded-sketch-notif"
      />
    </div>
  );
}
