import { Skeleton } from "@/components/ui/skeleton";
import { MealCardSkeleton } from "@/pages/meals/components/meal-card-skeleton";

export function MealLogMealsSkeleton() {
  return (
    <div>
      <Skeleton className="h-7 w-36 mb-2 mt-6" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="mb-2" key={index}>
          <MealCardSkeleton />
        </div>
      ))}
    </div>
  );
}
