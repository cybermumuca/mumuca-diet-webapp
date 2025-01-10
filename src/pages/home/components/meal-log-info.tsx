import { getMealLog } from "@/api/get-meal-log";
import { getMealTypeLabel } from "@/utils/get-meal-type-label";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { AlarmClock, CalendarIcon } from "lucide-react";
import { MealLogNotFoundError } from "../errors/meal-log-not-found-error";
import { MealLogInfoSkeleton } from "./meal-log-info-skeleton";

type MealLogInfoProps = {
  mealLogId: string;
};

export function MealLogInfo({ mealLogId }: MealLogInfoProps) {
  const { data: mealLog, isLoading: isMealLogLoading } = useQuery({
    queryKey: ["meal-log", mealLogId],
    queryFn: () => getMealLog(mealLogId),
  });

  if (isMealLogLoading) {
    return <MealLogInfoSkeleton />;
  }

  if (!mealLog) {
    throw new MealLogNotFoundError();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">{getMealTypeLabel(mealLog.type)}</h2>
      <div className="flex items-start gap-2 mb-2 mt-1">
        <p className="text-muted-foreground font-medium mb-4">
          <CalendarIcon className="w-4 h-4 inline-block translate-y-[-2px] mr-1" />
          {isToday(parseISO(mealLog.date))
            ? `${format(parseISO(mealLog.date), "dd/MM/yyyy")} (Hoje)`
            : isYesterday(parseISO(mealLog.date))
            ? `${format(parseISO(mealLog.date), "dd/MM/yyyy")} (Ontem)`
            : isTomorrow(parseISO(mealLog.date))
            ? `${format(parseISO(mealLog.date), "dd/MM/yyyy")} (Amanhã)`
            : format(parseISO(mealLog.date), "dd/MM/yyyy")}{" "}
        </p>
        <p className="text-muted-foreground font-medium">
          <AlarmClock className="w-4 h-4 inline-block translate-y-[-2px] ml-1" />{" "}
          {mealLog.time}
        </p>
      </div>
      <div className="flex flex-col items-start gap-1 mb-6">
        <h3 className="text-xl font-semibold">Meta de calorias</h3>
        <p className="text-muted-foreground font-medium">
          {mealLog.caloriesGoal} kcal
        </p>
      </div>
    </div>
  );
}
