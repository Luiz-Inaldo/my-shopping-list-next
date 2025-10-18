import React from 'react'
import { Skeleton } from '../ui/skeleton'

export function ShoppingListSkeleton() {
    return (
        <div className="relative space-y-0 min-h-screen">
            <div className="flex items-center gap-4 p-4">
                <Skeleton className="w-6 h-6 rounded-lg" />
                <Skeleton className="w-32 h-6 rounded-lg" />
            </div>
            <div className="p-4 w-full flex flex-col gap-5">
                <div className="bg-app-container rounded-lg p-3 space-y-4 shadow">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-6 h-6 rounded-lg" />
                        <Skeleton className="w-32 h-6 rounded-lg" />
                    </div>
                    <div className="flex items-center py-3 gap-8">
                        <div className="relative flex items-center justify-center ml-4 w-36 h-36">
                            <Skeleton className="w-32 h-32 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-app-container rounded-full" />
                        </div>
                        <div className="shrink-0 flex-1 grid gap-1 items-center">
                            <Skeleton className="w-28 h-6 rounded-lg" />
                            <Skeleton className="w-40 h-6 rounded-lg" />
                            <Skeleton className="w-40 h-6 rounded-lg" />
                        </div>
                    </div>
                </div>
                <Skeleton className="w-full h-10 rounded-lg" />
                <div className="grid grid-cols-3 place-items-center gap-3 pb-2">
                    <Skeleton className="w-28 h-10 rounded-lg" />
                    <Skeleton className="w-28 h-10 rounded-lg" />
                    <Skeleton className="w-28 h-10 rounded-lg" />
                </div>
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={`skeleton-${index}`}
                        className="flex items-center justify-between p-4 bg-white rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>
                ))}
            </div>
        </div>
    )
}
