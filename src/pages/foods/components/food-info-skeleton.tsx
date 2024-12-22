import { Skeleton } from "@/components/ui/skeleton";

export function FoodInfoSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-4" />

      <div className="mb-6">
        <Skeleton className="h-7 w-1/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
      </div>

      <div className="mb-2">
        <Skeleton className="h-7 w-2/5 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
      </div>

      <div className="bg-muted px-3 py-2 rounded-lg mb-6">
        {[...Array(17)].map((_, index) => (
          <div
            key={index}
            className="flex justify-between py-1 border-b border-gray-200 last:border-b-0"
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>

      <Skeleton className="h-7 w-1/4 mb-2" />
      <div className="bg-muted px-3 py-2 rounded-lg">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex justify-between py-1 border-b border-gray-200 last:border-b-0"
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
