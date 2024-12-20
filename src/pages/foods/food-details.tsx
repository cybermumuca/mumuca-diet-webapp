import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getFood } from "@/api/get-food";

export function FoodDetails() {
  const { foodId } = useParams();

  const { data: food } = useQuery({
    queryKey: ["food", foodId],
    queryFn: () => getFood({ foodId: foodId! }),
    enabled: !!foodId,
  });

  if (!food) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{food.title}</h1>
      {food.brand && <p className="text-muted-foreground">{food.brand}</p>}
      {food.description && <p>{food.description}</p>}
      
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Informação Nutricional</h2>
        <div className="space-y-1">
          {Object.entries(food.nutritionalInformation).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
