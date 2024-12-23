import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Unit } from "@/types/food";
import { getUnitLabel } from "@/utils/get-unit-label";
import { ComponentProps } from "react";

export type FoodCardProps = ComponentProps<typeof Card> & {
  title: string;
  brand: string | null;
  amount: number;
  unit: Unit;
  calories: number;
  onClick: () => void;
}

export function FoodCard({
  title,
  brand,
  amount,
  unit,
  calories,
  onClick,
  className,
  ...props
}: FoodCardProps) {
  const unitLabel = getUnitLabel(unit);

  return (
    <Card className={cn("p-4 cursor-pointer", className)} onClick={onClick} {...props}>
      <h3 className="font-medium">{title}</h3>
      {brand && <p className="text-sm text-muted-foreground">{brand}</p>}
      <p className="text-sm text-primary font-semibold">
        {amount} {unitLabel} • {calories} kcal
      </p>
    </Card>
  );
}
