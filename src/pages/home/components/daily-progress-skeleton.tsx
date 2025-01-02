import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DailyProgressSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-[200px] w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/3 mt-1" />
        </div>
        <div>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-1/3 mt-1" />
        </div>
      </CardContent>
    </Card>
  );
}
