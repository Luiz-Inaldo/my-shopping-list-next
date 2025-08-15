import React from 'react'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'

export function ProductsSearch() {
  return (
    <div className="relative">
        <Search size={16} className='text-paragraph absolute top-3 left-2.5' />
        <Input
            type="text"
            placeholder="Buscar por produto ou categoria..."
            onChange={(e) => console.log("O valor do input é: ", e.target.value)}
            className="pl-8 rounded-lg bg-app-container h-10 w-full placeholder:text-paragraph placeholder:text-sm text-paragraph text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow border-app-border"
        />
    </div>
  )
}
