import { Skeleton } from "@/components/ui/skeleton";

export function FoodMealsSkeleton() {
  return (
    <div>
      <Skeleton className="h-7 w-3/4 mb-2" />
      <Skeleton className="h-4 w-3/5 mb-2" />
    </div>
  );
}
