import { Skeleton } from "@/components/ui/skeleton";

export function BodyGoalSkeleton() {
  return (
    <section id="goal" className="mt-4">
      <Skeleton className="h-6 w-12 mb-2" />
      <div className="flex justify-between lg:justify-around border-[1px] rounded-lg p-4 w-full">
        <div className="flex flex-col gap-2 items-center justify-center">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </section>
  );
}
