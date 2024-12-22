import { Card } from "@/components/ui/card";
import { MealType } from "@/types/meal";
import { getMealTypeLabel } from "@/utils/get-meal-type-label";

export interface MealCardProps {
  title: string;
  type: MealType;
  calories?: number;
  onClick: () => void;
}

export function MealCard({ title, type, calories, onClick }: MealCardProps) {
  const typeLabel = getMealTypeLabel(type);

  return (
    <Card className="p-4 cursor-pointer" onClick={onClick}>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{typeLabel}</p>
      {calories && (
        <p className="text-sm text-primary font-semibold">{calories} kcal</p>
      )}
    </Card>
  );
}
