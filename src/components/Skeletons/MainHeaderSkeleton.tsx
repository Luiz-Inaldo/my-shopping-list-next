import { Skeleton } from '../ui/skeleton';

export function MainHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-10 flex w-full items-center gap-3 border-b-2 border-dashed border-sketch-muted bg-sketch-bg px-5 pb-4 pt-5">
      <Skeleton
        className="size-[52px] shrink-0 border-2 border-sketch-border"
        style={{
          borderRadius: '50% 40% 50% 40% / 40% 50% 40% 50%',
        }}
      />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-28 rounded-md" />
        <Skeleton className="h-6 w-36 rounded-md" />
      </div>
    </header>
  );
}
