import { Skeleton } from '../ui/skeleton';
import { SKETCH_RADIUS } from '@/lib/sketch-styles';

export function HomePagePurchaseSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`list-${index}`}
          className="w-full border-2 border-sketch-border bg-sketch-white p-4 shadow-sketch"
          style={{
            borderRadius: SKETCH_RADIUS.card,
            transform: index % 2 === 0 ? 'skewX(-1.25deg)' : 'skewX(1.25deg)',
          }}
        >
          <div className="mb-3 flex items-start justify-between">
            <Skeleton className="h-6 w-40 rounded-md" />
          </div>
          <div className="mb-3 flex gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          <Skeleton className="mb-4 h-2.5 w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
