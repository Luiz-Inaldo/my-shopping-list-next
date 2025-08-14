import { DollarSign, Goal, ShoppingCart, TrendingUp } from 'lucide-react'
import React from 'react'

export function MonthlyStatistics() {
    return (
        <div className='min-h-[100px] justify-center p-4 bg-app-container rounded-lg shadow-sm space-y-3'>
            <h3 className="text-subtitle text-sm font-medium">Estatísticas Mensais</h3>
            <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1 col-span-2 border text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/60 p-2 rounded-lg border-green-100 dark:border-green-900">
                    <div className="flex items-center gap-2">
                        <DollarSign size={14} />
                        <span className="text-xs font-medium">Gastos</span>
                    </div>
                    <p className='font-semibold text-green-800 dark:text-green-600'>R$ 1.000,00</p>
                    <p className="text-xs leading-none">-12% vs mês anterior</p>
                </div>
                <div className="space-y-1 col-span-2 border text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 p-2 rounded-lg border-sky-100 dark:border-sky-900">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={14} />
                        <span className="text-xs font-medium">Listas</span>
                    </div>
                    <p className='font-semibold text-sky-800 dark:text-sky-600'>15</p>
                    <p className="text-xs">3 ativas</p>
                </div>
                <div className="space-y-1 col-span-2 border text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 p-2 rounded-lg border-purple-100 dark:border-purple-900">
                    <div className="flex items-center gap-2">
                        <Goal size={14} />
                        <span className="text-xs font-medium">Items</span>
                    </div>
                    <p className='font-semibold text-purple-800 dark:text-purple-600'>240</p>
                    <p className="text-xs">94% concluídos</p>
                </div>
                <div className="space-y-1 col-span-2 border text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 p-2 rounded-lg border-orange-100 dark:border-orange-900">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={14} />
                        <span className="text-xs font-medium">Economia</span>
                    </div>
                    <p className='font-semibold text-orange-800 dark:text-orange-600'>R$ 68,00</p>
                    <p className="text-xs">atual vs anterior</p>
                </div>
            </div>
        </div>
    )
}
