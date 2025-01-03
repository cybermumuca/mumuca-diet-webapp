import { getDailyProgress } from "@/api/get-daily-progress";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DailyProgressSkeleton } from "./daily-progress-skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { MacronutrientChart } from "./macronutrient-chart";

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
      const formattedDate = format(date, "dd/MM/yyyy");
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
        <CarouselItem>
          <MacronutrientChart
            name={"Carboidratos"}
            consumed={dailyProgress.macronutrientsConsumed.carbs}
            target={dailyProgress.macronutrientsTarget.carbs}
            color="#FFB74D"
          />
        </CarouselItem>
        <CarouselItem>
          <MacronutrientChart
            name={"Proteínas"}
            consumed={dailyProgress.macronutrientsConsumed.protein}
            target={dailyProgress.macronutrientsTarget.protein}
            color="#4FC3F7"
          />
        </CarouselItem>
        <CarouselItem>
          <MacronutrientChart
            name={"Gorduras"}
            consumed={dailyProgress.macronutrientsConsumed.fat}
            target={dailyProgress.macronutrientsTarget.fat}
            color="#fd4739"
          />
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
