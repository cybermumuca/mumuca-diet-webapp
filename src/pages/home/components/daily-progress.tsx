import { getDailyProgress } from "@/api/get-daily-progress";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DailyProgressSkeleton } from "./daily-progress-skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GoalChart } from "./goal-chart";

type DailyProgressProps = {
  date: Date;
};

export function DailyProgress({ date }: DailyProgressProps) {
  const {
    data: dailyProgress,
    isLoading: isDailyProgressLoading,
    error,
  } = useQuery({
    queryKey: ["dailyProgress", date],
    queryFn: () => {
      const formattedDate = format(date, "yyyy-MM-dd");
      return getDailyProgress({ date: formattedDate });
    },
  });

  if (isDailyProgressLoading) {
    return <DailyProgressSkeleton />;
  }

  if (!dailyProgress) {
    throw error;
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <GoalChart
            name={"Calorias"}
            consumed={dailyProgress.caloriesConsumed}
            target={dailyProgress.targetCalories}
            color="#f04343"
            unit="kcal"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <GoalChart
            name={"Água"}
            consumed={dailyProgress.waterIngested}
            target={dailyProgress.waterIntakeTarget}
            color="#19f2f9"
            unit="L"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <GoalChart
            name={"Carboidratos"}
            consumed={dailyProgress.macronutrientsConsumed.carbs}
            target={dailyProgress.macronutrientsTarget.carbs}
            color="#FFB74D"
            unit="g"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <GoalChart
            name={"Proteínas"}
            consumed={dailyProgress.macronutrientsConsumed.protein}
            target={dailyProgress.macronutrientsTarget.protein}
            color="#8B4513"
            unit="g"
          />
        </CarouselItem>
        <CarouselItem className="md:basis-1/2 lg:basis-1/3">
          <GoalChart
            name={"Gorduras"}
            consumed={dailyProgress.macronutrientsConsumed.fat}
            target={dailyProgress.macronutrientsTarget.fat}
            color="#ee6511"
            unit="g"
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext  />
    </Carousel>
  );
}
