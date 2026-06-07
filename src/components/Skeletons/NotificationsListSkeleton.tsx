import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function NotificationsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={`notification-skeleton-${index}`} className="overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex gap-4">
              <Skeleton className="size-14 shrink-0 rounded-sketch-avatar border-2 border-sketch-border" />

              <div className="min-w-0 flex-1 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/2 rounded-md" />
                  <Skeleton className="h-4 w-1/3 rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                </div>

                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-10 w-24 rounded-sketch-btn" />
                  <Skeleton className="h-10 w-24 rounded-sketch-btn" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}