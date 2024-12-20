import { Card } from "@/components/ui/card";

export interface FoodCardProps {
  id: string;
  title: string;
  brand?: string;
  calories?: number;
  onClick: (id: string) => void;
}

export function FoodCard({
  id,
  title,
  brand,
  calories,
  onClick,
}: FoodCardProps) {
  return (
    <Card className="p-4 cursor-pointer" onClick={() => onClick(id)}>
      <h3 className="font-medium">{title}</h3>
      {brand && <p className="text-sm text-muted-foreground">{brand}</p>}
      {calories && (
        <p className="text-sm text-primary font-semibold">{calories} kcal</p>
      )}
    </Card>
  );
}
