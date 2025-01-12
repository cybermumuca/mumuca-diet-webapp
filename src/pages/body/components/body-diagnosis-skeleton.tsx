import { Skeleton } from "@/components/ui/skeleton";

export function BodyDiagnosisSkeleton() {
  return (
    <section id="diagnosis" className="mt-4">
      <div className="flex items-center justify-between mt-4 mb-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
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
