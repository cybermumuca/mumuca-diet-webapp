import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MealType } from "@/types/meal";
import { getMealTypeLabel } from "@/utils/get-meal-type-label";
import { ComponentProps } from "react";

export type MealCardProps = ComponentProps<typeof Card> & {
  title: string;
  type: MealType;
  calories?: number;
  onClick: () => void;
};

export function MealCard({
  title,
  type,
  calories,
  onClick,
  className,
  ...props
}: MealCardProps) {
  const typeLabel = getMealTypeLabel(type);

  return (
    <Card
      className={cn("p-4 cursor-pointer", className)}
      onClick={onClick}
      {...props}
    >
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{typeLabel}</p>
      {calories && (
        <p className="text-sm text-primary font-semibold">{calories} kcal</p>
      )}
    </Card>
  );
}
