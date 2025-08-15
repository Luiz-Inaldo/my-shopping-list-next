import React from 'react'
import { Checkbox } from '../ui/Custom/Checkbox'
import { EllipsisVertical } from 'lucide-react'

export function Product() {
    return (
        <div className="space-y-2 p-3 rounded-lg bg-[#F2FFF3] shadow text-sm text-paragraph">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox />
                    <p title='Macarrão Espaguete Vitarella 400g' className="truncate max-w-72">Macarrão Espaguete Vitarella 400g</p>
                </div>
                <EllipsisVertical size={16} />
            </div>
            <div className="flex items-center justify-between pl-7">
                <div className="flex gap-3">
                    <p>10 und</p>
                    <p>X</p>
                    <p>R$: 2,50</p>
                </div>
                <p className='font-medium text-base text-app-primary'>R$: 25,00</p>
            </div>
        </div>
    )
}
