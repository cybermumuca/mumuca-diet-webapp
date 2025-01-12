import { Skeleton } from "@/components/ui/skeleton";

export function BodyHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <Skeleton className="w-20 h-9 mb-6" />
      <Skeleton className="rounded-full h-8 w-8 translate-y-[-10px]" />
    </div>
  );
}
