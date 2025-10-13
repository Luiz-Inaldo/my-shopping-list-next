"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryDistributionChartSkeleton() {
  return (
    <Card className="bg-app-container shadow-md border rounded-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold text-title">
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription className="text-paragraph grid gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardDescription>
      </CardHeader>
      <CardContent className="relative p-4">
        <div className="flex items-center justify-center h-64">
          <Skeleton className="w-48 h-48 rounded-full" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="col-span-1 flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-sm" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
