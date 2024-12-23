import { getFood } from "@/api/get-food";
import { useQuery } from "@tanstack/react-query";
import { getUnitLabel } from "@/utils/get-unit-label";
import { NutritionItem } from "../../shared/components/nutrition-item";
import { FoodInfoSkeleton } from "./food-info-skeleton";
import { FoodNotFoundError } from "../errors/food-not-found-error";
import { isAxiosError } from "axios";

interface FoodInfoProps {
  foodId: string;
}

export function FoodInfo({ foodId }: FoodInfoProps) {
  const {
    data: food,
    isFetching: isFetchingFood,
    error,
  } = useQuery({
    queryKey: ["food", foodId],
    queryFn: () => getFood({ foodId }),
    staleTime: 1000 * 60 * 15,
    retry: false,
  });

  if (isFetchingFood) {
    return <FoodInfoSkeleton />;
  }

  if (error || !food) {
    if (error && !isAxiosError(error)) {
      throw error;
    }

    throw new FoodNotFoundError();
  }

  const descriptionText = food.description ? (
    <p className="text-sm break-words whitespace-pre-wrap max-w-full">
      {food.description}
    </p>
  ) : (
    <p className="text-muted-foreground text-sm">Sem descrição disponível.</p>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">{food.title}</h1>
      <h2 className="text-muted-foreground font-semibold mb-4">
        {food.brand ?? "Sem marca"}
      </h2>
      <div className="flex flex-col items-start gap-1 mb-6">
        <h2 className="text-xl font-semibold">Descrição</h2>
        {descriptionText}
      </div>

      <div className="mb-2">
        <h2 className="text-xl font-semibold">Tabela nutricional</h2>
        <p className="text-muted-foreground text-sm">
          Para {food.portion.amount} {getUnitLabel(food.portion.unit)}{" "}
          {food.portion.description ? `(${food.portion.description})` : ""}
        </p>
      </div>
      <div className="bg-muted px-3 py-2 rounded-lg mb-6">
        <>
          <NutritionItem
            label="Calorias"
            value={food.nutritionalInformation.calories}
            unit="kcal"
          />
          <NutritionItem
            label="Carboidratos"
            value={food.nutritionalInformation.carbohydrates}
            unit="g"
          />
          <NutritionItem
            label="Proteínas"
            value={food.nutritionalInformation.protein}
            unit="g"
          />
          <NutritionItem
            label="Gorduras"
            value={food.nutritionalInformation.fat}
            unit="g"
          />
          <NutritionItem
            label="Fibra"
            value={food.nutritionalInformation.fiber}
            unit="g"
          />
          <NutritionItem
            label="Açucar"
            value={food.nutritionalInformation.sugar}
            unit="g"
          />
          <NutritionItem
            label="Sódio"
            value={food.nutritionalInformation.sodium}
            unit="mg"
          />
          <NutritionItem
            label="Potássio"
            value={food.nutritionalInformation.potassium}
            unit="mg"
          />
          <NutritionItem
            label="Colesterol"
            value={food.nutritionalInformation.cholesterol}
            unit="mg"
          />
          <NutritionItem
            label="Cálcio"
            value={food.nutritionalInformation.calcium}
            unit="mg"
          />
          <NutritionItem
            label="Ferro"
            value={food.nutritionalInformation.iron}
            unit="mg"
          />
          <NutritionItem
            label="Vitamina A"
            value={food.nutritionalInformation.vitaminA}
            unit="UI"
          />
          <NutritionItem
            label="Vitamina C"
            value={food.nutritionalInformation.vitaminC}
            unit="mg"
          />
        </>
      </div>
      <h3 className="text-lg font-semibold mb-2">Gorduras</h3>
      <div className="bg-muted px-3 py-2 rounded-lg">
        <>
          <NutritionItem
            label="Gordura saturada"
            value={food.nutritionalInformation.saturatedFat}
            unit="g"
          />
          <NutritionItem
            label="Gordura monoinsaturada"
            value={food.nutritionalInformation.monounsaturatedFat}
            unit="g"
          />
          <NutritionItem
            label="Gordura poliinsaturada"
            value={food.nutritionalInformation.polyunsaturatedFat}
            unit="g"
          />
          <NutritionItem
            label="Gordura trans"
            value={food.nutritionalInformation.transFat}
            unit="g"
          />
        </>
      </div>
    </div>
  );
}
