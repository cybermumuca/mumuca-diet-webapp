import { Skeleton } from "@/components/ui/skeleton";

export function DiaryHeaderSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Skeleton className="w-52 h-9 mb-6" />
        <Skeleton className={`rounded-full h-8 w-8 translate-y-[-10px]`} />
      </div>
      <div className="w-full flex items-center justify-between mb-6 gap-2">
        <Skeleton className="w-9 h-9" />
        <Skeleton className="w-full h-9" />
        <Skeleton className="w-9 h-9" />
      </div>
    </div>
  );
}
