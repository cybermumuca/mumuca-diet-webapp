import { Skeleton } from "@/components/ui/skeleton";

export function MealInfoSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-4" />

      <div className="mb-6">
        <Skeleton className="h-7 w-1/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
      </div>
    </div>
  );
}
