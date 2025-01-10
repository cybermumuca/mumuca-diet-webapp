import { Skeleton } from "@/components/ui/skeleton";
import { FoodCardSkeleton } from "@/pages/foods/components/food-card-skeleton";

export function MealLogFoodsSkeleton() {
  return (
    <div>
      <Skeleton className="h-7 w-36 mb-2 mt-6" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="mb-2" key={index}>
          <FoodCardSkeleton />
        </div>
      ))}
    </div>
  );
}
