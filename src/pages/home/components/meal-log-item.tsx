import { ProgressIndicator } from "@/components/progress-indicator";
import { Badge } from "@/components/ui/badge";
import { MealType } from "@/types/meal";
import { getMealTypeLabel } from "@/utils/get-meal-type-label";

type MealLogItemProps = {
  type: MealType;
  time: string;
  isFromPreferences: boolean;
  caloriesConsumed: number;
  caloriesGoal: number;
};

export function MealLogItem({
  type,
  time,
  caloriesConsumed,
  caloriesGoal,
  isFromPreferences,
}: MealLogItemProps) {
  return (
    <div className="border-[1px] rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-2 justify-start items-start">
          <h3 className="font-semibold">{getMealTypeLabel(type)}</h3>

          {isFromPreferences && (
            <Badge variant="secondary">Refeição Preferida</Badge>
          )}
        </div>
        <span className="text-sm text-muted-foreground self-stretch">
          {time}
        </span>
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
