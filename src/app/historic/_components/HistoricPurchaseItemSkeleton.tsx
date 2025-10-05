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
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between"
        >
          {/* Left Section - Content Skeleton */}
          <div className="flex items-center gap-3">
            {/* Top Line - Title with Orange Dot Skeleton */}
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-2.5 h-2.5 rounded-full" />
            </div>

            {/* Bottom Line - Amount and Date Skeleton */}
            <div className="space-y-1">
              <Skeleton className="w-32 h-4 rounded-md" />
              <div className="flex items-center gap-3">
                <Skeleton className="w-20 h-4 rounded-md" />
                <div className="w-px h-4 bg-gray-200" />
                <Skeleton className="w-16 h-4 rounded-md" />
              </div>
            </div>
          </div>

          {/* Right Section - Action Icons Skeleton */}
          <div className="flex items-center gap-3 ml-4">
            <Skeleton className="w-6 h-6 rounded-md" />
            <Skeleton className="w-6 h-6 rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
}
