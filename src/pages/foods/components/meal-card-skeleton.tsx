import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MealCardSkeleton() {
  return (
    <Card className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </Card>
  );
}
