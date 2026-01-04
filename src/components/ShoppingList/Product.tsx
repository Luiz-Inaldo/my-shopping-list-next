import React from 'react'
import { Check, Square } from 'lucide-react'
import { IProductProps } from '@/types'
import { formatCurrency } from '@/functions/formatCurrency'
import { CheckItemForm } from '../Forms/CheckItemForm'
import { useShoplistContext } from '@/context/ShoplistContext'
import { ListItemDropdown } from '../Dropdown/ListItemDropdown'

export function Product({ item, ...props }: { item: IProductProps }) {

    const { handleCheckItem, handleDismarkItem } = useShoplistContext();

    const handleItemCheckbox = (product: IProductProps) => {

        if (!product.checked && product.value !== 0) {
            handleCheckItem(product);
        } else if (product.checked) {
            handleDismarkItem(product);
        }
    };

    function renderCheckbox() {
        if (!item.checked && item.value === 0) {
            return <CheckItemForm item={item} />;
        } else if (!item.checked) {
            return <Square onClick={() => handleItemCheckbox(item)} size={18} className="text-paragraph" />
        }

        return <Check onClick={() => handleItemCheckbox(item)} size={18} className="text-app-primary" />;

    }

    return (
        <div {...props} className={`space-y-2 p-3 rounded-lg ${item.checked ? 'bg-[#F2FFF3]' : 'bg-app-container'} shadow text-sm text-paragraph`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {renderCheckbox()}
                    <p title='Macarrão Espaguete Vitarella 400g' className="truncate max-w-72">
                        {item.name}
                    </p>
                </div>
                <ListItemDropdown item={item} />
            </div>
            <div className="flex items-center justify-between pl-7">
                <div className="flex gap-3">
                    <p>{String(item.quantity).replace(".", ",")} {item.unit_type}</p>
                    <p>X</p>
                    <p>{formatCurrency(item.value as number)}</p>
                </div>
                <p className='font-medium text-base text-app-primary'>{formatCurrency(Number(item.value) * Number(item.quantity))}</p>
            </div>
        </div>
    )
}
