import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";

export function DailyMealLogSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-6 w-24" />
        <Button variant="ghost" size="icon" disabled>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div className="mt-2 space-y-4 mb-8 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border-[1px] rounded-lg p-4 w-full">
            <div className="flex justify-between items-center mb-2">  
              <div className="flex flex-col gap-2 justify-start items-start">
                <Skeleton className="h-5 w-24" />
                {index % 2 === 0 && <Skeleton className="h-5 w-28 rounded-full" />}
              </div>
              <Skeleton className="h-4 w-12 self-stretch" />
            </div>
            <div className="mb-2">
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-4 rounded-full w-full mb-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
