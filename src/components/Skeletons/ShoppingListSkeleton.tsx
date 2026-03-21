import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function ShoppingListSkeleton() {
  return (
    <div className="sketch-shell relative flex min-h-screen-dvh flex-col gap-4 px-4">
      <div className="flex items-center gap-4 border-b-2 border-dashed border-sketch-muted bg-sketch-bg px-4 py-4">
        <Skeleton className="h-6 w-6 rounded-sketch-notif" />
        <Skeleton className="h-6 w-32 rounded-sketch-notif" />
      </div>
      <div className="flex flex-col gap-4 pb-4">
        <Skeleton className="h-10 w-full rounded-sketch-notif" />
        <div className="flex gap-2 overflow-hidden pb-1">
          <Skeleton className="h-10 w-24 shrink-0 rounded-sketch-notif" />
          <Skeleton className="h-10 w-28 shrink-0 rounded-sketch-notif" />
          <Skeleton className="h-10 w-20 shrink-0 rounded-sketch-notif" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20 rounded-sketch-section-label" />
            <Skeleton className="h-3 w-24 rounded-sketch-section-label" />
          </div>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex items-center justify-between gap-3 rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-3 shadow-sketch-sm"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-5 shrink-0 rounded-sketch-section-label" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
