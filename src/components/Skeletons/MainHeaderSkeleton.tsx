import React from 'react'
import { Skeleton } from '../ui/skeleton'

export function MainHeaderSkeleton() {
    return (
        <div className="relative z-[1] w-full p-4 h-[70px] flex items-center gap-3">
            <Skeleton className='size-10 rounded-full' />
            <div className='flex flex-col gap-1'>
                <Skeleton className="w-36 h-[18px] rounded-md" />
                <Skeleton className="w-40 h-5 rounded-md" />
            </div>
        </div>
    )
}
