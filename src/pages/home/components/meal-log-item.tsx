import { ProgressIndicator } from "@/components/progress-indicator";
import { MealType } from "@/types/meal";
import { getMealTypeLabel } from "@/utils/get-meal-type-label";

type MealLogItemProps = {
  type: MealType;
  time: string;
  caloriesConsumed: number;
  caloriesGoal: number;
};

export function MealLogItem({
  type,
  time,
  caloriesConsumed,
  caloriesGoal,
}: MealLogItemProps) {
  return (
    <div className="border-[1px] rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{getMealTypeLabel(type)}</h3>
        <span className="text-sm text-muted-foreground">{time}</span>
      </div>
      <div className="mb-2">
        <span className="text-xl font-medium">{caloriesConsumed}</span>
        <span className="text-muted-foreground"> / {caloriesGoal} kcal</span>
      </div>
      <ProgressIndicator
        currentStep={caloriesConsumed}
        totalSteps={caloriesGoal}
      />
    </div>
  );
}
