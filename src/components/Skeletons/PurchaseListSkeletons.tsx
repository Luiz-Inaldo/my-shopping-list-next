import { Skeleton } from "../ui/skeleton";

export function HomePagePurchaseSkeleton() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={`list-${index}`}
                    className="w-full bg-app-container rounded-lg flex flex-col gap-3 p-3"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-2 rounded-full" />
                            <Skeleton className="w-28 h-5 rounded-md" />
                        </div>
                        <Skeleton className="size-4 rounded-full" />
                    </div>
                    <div className="flex text-xs items-center justify-between">
                        <Skeleton className="w-36 h-4 rounded-md" />
                        <Skeleton className="w-10 h-4 rounded-md" />
                    </div>
                </div>
            ))}
        </>
    )
}