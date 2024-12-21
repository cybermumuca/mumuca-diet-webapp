import { Card } from "@/components/ui/card";
import { Unit } from "@/types/food";
import { getUnitLabel } from "@/utils/get-unit-label";

export interface FoodCardProps {
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
}: FoodCardProps) {
  const unitLabel = getUnitLabel(unit);

  return (
    <Card className="p-4 cursor-pointer" onClick={onClick}>
      <h3 className="font-medium">{title}</h3>
      {brand && <p className="text-sm text-muted-foreground">{brand}</p>}
      <p className="text-sm text-primary font-semibold">
        {amount} {unitLabel} • {calories} kcal
      </p>
    </Card>
  );
}
