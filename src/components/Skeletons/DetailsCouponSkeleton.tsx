"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function DetailsCouponSkeleton() {
  return (
    <div>
      {/* Title skeleton */}
      <Skeleton className="h-6 w-48 mb-3" />

      {/* Receipt Box skeleton */}
      <div className="bg-app-container rounded-lg shadow-md p-6 mb-6">
        {/* Store Information skeleton */}
        <div className="text-center mb-4">
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>

        {/* Table Headers skeleton */}
        <div className="flex gap-1 mb-2 py-4 border-t border-b border-slate-400 dark:border-app-border border-dotted">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Items List skeleton */}
        <div className="space-y-2 mb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-1">
              <Skeleton className="h-4 flex-1 max-w-[186px]" />
              <Skeleton className="h-4 w-[34px]" />
              <Skeleton className="h-4 w-[47px]" />
              <Skeleton className="h-4 w-[56px]" />
            </div>
          ))}
        </div>

        {/* Total Section skeleton */}
        <div className="flex justify-between items-center mb-2 py-4 border-t border-b border-slate-400 dark:border-app-border border-dotted">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Disclaimer skeleton */}
        <div className="text-center">
          <Skeleton className="h-3 w-48 mx-auto" />
        </div>
      </div>

      {/* Generate PDF Button skeleton */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
