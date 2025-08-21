import { CATEGORIES } from '@/constants/categories'
import { useShoplistContext } from '@/context/ShoplistContext';
import { useState } from 'react';

export function CategoryBadgesList() {

    const { auxData, setProductsList, filterValue, setFilterValue } = useShoplistContext();

    function handleFilterByCategory(category: string) {
        const filteredItems = auxData?.purchase_items?.filter(item => item.category === category) ?? [];
        setFilterValue(category);
        setProductsList(oldList => ({
            ...oldList!,
            purchase_items: filteredItems
        }));
    }

    if (!auxData) return null;

    return (
        <div className="flex items-center gap-3 overflow-x-scroll scrollbar-hide">
            <>
                {CATEGORIES.map((category) => {
                    const totalItemsOnCurrentCategory = auxData.purchase_items?.filter(item => item.category === category.name).length;

                    if (totalItemsOnCurrentCategory === 0) return null;

                    return (
                        <div
                            onClick={() => handleFilterByCategory(category.name)}
                            key={category.name}
                            className={`flex items-center gap-3 px-3 py-2 border rounded-lg shadow ${filterValue === category.name ? 'bg-default-green border-green-500 text-snow' : 'border-app-border bg-app-container'}`}
                        >
                            <span
                                style={{ backgroundColor: category.backgroundColor }}
                                className="w-2 h-2 shrink-0 rounded-full"
                            />
                            <p
                                className={`text-xs whitespace-nowrap ${filterValue === category.name ? 'text-snow' : 'text-subtitle'}`}
                            >
                                {category.name}
                            </p>
                            <div className="size-6 p-2 flex items-center justify-center bg-title rounded-full text-snow dark:text-[#212121]">
                                <p className='text-xs'>{totalItemsOnCurrentCategory}</p>
                            </div>
                        </div>
                    )
                })}
            </>
        </div>
    )
}
