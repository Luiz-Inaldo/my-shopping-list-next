import { Skeleton } from "@/components/ui/skeleton";

interface HistoricPurchaseItemSkeletonProps {
  count?: number;
}

export function HistoricPurchaseItemSkeleton({ count = 1 }: HistoricPurchaseItemSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`historic-purchase-skeleton-${index}`}
          className="rounded-sketch-card border-2 border-sketch-border bg-sketch-white p-4 flex items-center justify-between shadow-sketch-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-2.5 h-2.5 rounded-full bg-sketch-muted" />
            </div>

            <div className="space-y-1">
              <Skeleton className="w-32 h-4 rounded-sketch-section-label bg-sketch-muted" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-20 h-4 rounded-sketch-section-label bg-sketch-muted" />
                <div className="w-px h-4 bg-sketch-muted" />
                <Skeleton className="w-16 h-4 rounded-sketch-section-label bg-sketch-muted" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Skeleton className="w-6 h-6 rounded-sketch-section-label bg-sketch-muted" />
            <Skeleton className="w-6 h-6 rounded-sketch-section-label bg-sketch-muted" />
          </div>
        </div>
      ))}
    </>
  );
}
