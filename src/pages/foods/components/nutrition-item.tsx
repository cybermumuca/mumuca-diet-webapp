export interface NutritionItemProps {
  label: string;
  value: number;
  unit: string;
}

export function NutritionItem({ label, value, unit }: NutritionItemProps) {
  const formattedValue =
    label === "Calorias" ? value.toFixed(0) : value.toFixed(2);

  return (
    <div className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
      <span>{label}</span>
      <span>
        {formattedValue} {unit}
      </span>
    </div>
  );
}
