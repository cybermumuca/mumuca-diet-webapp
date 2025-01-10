import { Skeleton } from "@/components/ui/skeleton";

export function MealLogInfoSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-48 mb-2" />
      <div className="flex items-start gap-2 mb-2 mt-1">
        <div className="flex items-center">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center mb-4">
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="flex flex-col items-start gap-1 mb-6">
        <Skeleton className="h-5 w-40 mb-1" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
