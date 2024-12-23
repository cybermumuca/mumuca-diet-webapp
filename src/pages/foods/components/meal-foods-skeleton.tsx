import { Skeleton } from "@/components/ui/skeleton";
import { FoodCardSkeleton } from "./food-card-skeleton";

export function MealFoodsSkeleton() {
  return (
    <div>
      <Skeleton className="h-7 w-3/4 mb-2" />
      {Array.from({ length: 5 }).map((_, index) => (
        <FoodCardSkeleton key={index} />
      ))}
    </div>
  );
}
