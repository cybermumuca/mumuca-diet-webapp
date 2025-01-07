import { Skeleton } from "@/components/ui/skeleton";

export function DailyMealLogSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mt-6">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="h-6 w-6 mr-2" />
      </div>
      <div className="mt-4 space-y-4 mb-8 w-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-32" />
        ))}
      </div>
    </div>
  );
}
