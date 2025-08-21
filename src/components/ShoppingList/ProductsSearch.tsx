import React, { useMemo } from 'react'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { debounce } from '@/functions/debounce'
import { useShoplistContext } from '@/context/ShoplistContext'
import { CATEGORIES } from '@/constants/categories'

export function ProductsSearch() {

  const { auxData, setProductsList } = useShoplistContext();

  const debouncedQuery = useMemo(() => {
    return debounce((value: string) => {

      const categoriesToLowerCase = CATEGORIES.map(category => category.name.toLowerCase());

      if (!value) {
        setProductsList(auxData);
        return;
      }

      if (categoriesToLowerCase.includes(value)) {
        const filteredList = auxData?.purchase_items?.filter(product => product.category.toLocaleLowerCase() === value) ?? [];
        setProductsList(oldList => ({
          ...oldList!,
          purchase_items: filteredList
        }));
        return;
      }

      const filteredList = auxData?.purchase_items?.filter(product => product.name.toLowerCase().includes(value)) ?? [];
      setProductsList(oldList => ({
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
