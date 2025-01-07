import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function DailyProgressSkeleton() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0 mt-2">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="flex-1 pb-0 mb-7 mt-4">
                <Skeleton className="h-[170px] w-[170px] rounded-full mx-auto" />
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <Skeleton className="h-4 w-44 mb-[2px]" />
                <Skeleton className="h-4 w-48 mb-1" />
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
