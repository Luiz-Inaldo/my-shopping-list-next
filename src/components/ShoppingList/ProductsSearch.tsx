import React, { useMemo } from 'react'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { debounce } from '@/functions/debounce'
import { useShoplistContext } from '@/context/ShoplistContext'
import { CATEGORIES } from '@/constants/categories'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { IPurchaseProps } from '@/types'

export function ProductsSearch() {

  const { auxData, productsList } = useShoplistContext();
  console.log(auxData)
  const queryClient = useQueryClient();

  const debouncedQuery = useMemo(() => {
    return debounce((value: string) => {

      const searchValue = value.toLowerCase();
      
      const categoriesToLowerCase = CATEGORIES.map(category => category.name.toLowerCase());

      if (!searchValue) {
        queryClient.setQueryData([QUERY_KEYS.productsList, productsList?.id], auxData);
        return;
      }

      if (categoriesToLowerCase.some(category => category.includes(searchValue))) {
        const filteredList = auxData?.purchase_items?.filter(product => product.category.toLowerCase() === searchValue) ?? [];
        queryClient.setQueryData([QUERY_KEYS.productsList, productsList?.id], (oldList: IPurchaseProps | undefined) => ({
          ...oldList!,
          purchase_items: filteredList
        }));
        return;
      }

      const filteredList = auxData?.purchase_items?.filter(product => product.name.toLowerCase().includes(searchValue)) ?? [];

      queryClient.setQueryData([QUERY_KEYS.productsList, productsList?.id], (oldList: IPurchaseProps | undefined) => ({
        ...oldList!,
        purchase_items: filteredList
      }));
    }, 1000);
    //eslint-disable-next-line
  }, []);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    debouncedQuery(value);
  }

  return (
    <div className="relative">
      <Search size={16} className='text-paragraph absolute top-3 left-2.5' />
      <Input
        type="text"
        placeholder="Buscar por produto ou categoria..."
        onChange={handleFilter}
        className="pl-8 rounded-lg bg-app-container h-10 w-full placeholder:text-paragraph placeholder:text-sm text-paragraph text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow border-app-border"
      />
    </div>
  )
}
