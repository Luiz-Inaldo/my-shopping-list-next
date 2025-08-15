import React from 'react'

export function CategoryBadgesList() {
  return (
    <div className="flex items-center gap-3 overflow-x-scroll scrollbar-hide">
        <div className="flex items-center gap-3 px-3 py-2 border border-app-border rounded-lg bg-app-container">
            <span className="w-2 h-2 shrink-0 rounded-full bg-green-400"/>
            <p className="text-xs text-subtitle">Mercearia</p>
            <div className="size-7 p-2 flex items-center justify-center bg-title rounded-full text-snow dark:text-[#212121]">
                <p className='text-xs'>12</p>
            </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 border border-app-border rounded-lg bg-app-container">
            <span className="w-2 h-2 shrink-0 rounded-full bg-blue-400"/>
            <p className="text-xs text-subtitle">Limpeza</p>
            <div className="size-7 p-2 flex items-center justify-center bg-title rounded-full text-snow dark:text-[#212121]">
                <p className='text-xs'>12</p>
            </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 border border-app-border rounded-lg bg-app-container">
            <span className="w-2 h-2 shrink-0 rounded-full bg-purple-400"/>
            <p className="text-xs text-subtitle whitespace-nowrap">Higiene Pessoal</p>
            <div className="size-7 p-2 flex items-center justify-center bg-title rounded-full text-snow dark:text-[#212121]">
                <p className='text-xs'>12</p>
            </div>
        </div>
    </div>
  )
}
