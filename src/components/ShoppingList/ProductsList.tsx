import React from 'react'
import { Product } from './Product'

export function ProductsList() {
  return (
    <div className='space-y-5'>
        <div className="flex items-center justify-between">
            <h3 className="text-subtitle text-sm font-medium">Produtos</h3>
            <div className="flex items-center gap-2 text-xs text-paragraph italic">12/15 marcados</div>
        </div>
        <div className="space-y-3">
            <Product />
        </div>
    </div>
  )
}
