import { useQuery } from "@tanstack/react-query";
import { NutritionItem } from "../../shared/components/nutrition-item";
import { getMealNutritionalInformation } from "@/api/get-meal-nutritional-information";
import { isAxiosError } from "axios";
import { MealNotFoundError } from "../errors/meal-not-found-error";
import { MealNutritionalInformationSkeleton } from "./meal-nutritional-information-skeleton";

export type MealNutritionalInformationProps = {
  mealId: string;
};

export function MealNutritionalInformation({
  mealId,
}: MealNutritionalInformationProps) {
  const {
    data: nutritionalInformation,
    isFetching: isFetchingMeal,
    error,
  } = useQuery({
    queryKey: ["mealNutritionalInformation", mealId],
    queryFn: () => getMealNutritionalInformation({ mealId }),
    staleTime: 1000 * 60 * 15,
    retry: false,
  });

  if (isFetchingMeal) {
    return <MealNutritionalInformationSkeleton />;
  }

  if (error || !nutritionalInformation) {
    if (error && !isAxiosError(error)) {
      throw error;
    }

    throw new MealNotFoundError();
  }

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-xl font-semibold">Tabela nutricional</h2>
      </div>
      <div className="bg-muted px-3 py-2 rounded-lg mb-6">
        <>
          <NutritionItem
            label="Calorias"
            value={nutritionalInformation.calories}
            unit="kcal"
          />
          <NutritionItem
            label="Carboidratos"
            value={nutritionalInformation.carbohydrates}
            unit="g"
          />
          <NutritionItem
            label="Proteínas"
            value={nutritionalInformation.protein}
            unit="g"
          />
          <NutritionItem
            label="Gorduras"
            value={nutritionalInformation.fat}
            unit="g"
          />
          <NutritionItem
            label="Fibra"
            value={nutritionalInformation.fiber}
            unit="g"
          />
          <NutritionItem
            label="Açucar"
            value={nutritionalInformation.sugar}
            unit="g"
          />
          <NutritionItem
            label="Sódio"
            value={nutritionalInformation.sodium}
            unit="mg"
          />
          <NutritionItem
            label="Potássio"
            value={nutritionalInformation.potassium}
            unit="mg"
          />
          <NutritionItem
            label="Colesterol"
            value={nutritionalInformation.cholesterol}
            unit="mg"
          />
          <NutritionItem
            label="Cálcio"
            value={nutritionalInformation.calcium}
            unit="mg"
          />
          <NutritionItem
            label="Ferro"
            value={nutritionalInformation.iron}
            unit="mg"
          />
          <NutritionItem
            label="Vitamina A"
            value={nutritionalInformation.vitaminA}
            unit="UI"
          />
          <NutritionItem
            label="Vitamina C"
            value={nutritionalInformation.vitaminC}
            unit="mg"
          />
        </>
      </div>
      <h3 className="text-lg font-semibold mb-2">Gorduras</h3>
      <div className="bg-muted px-3 py-2 mb-2 rounded-lg">
        <>
          <NutritionItem
            label="Gordura saturada"
            value={nutritionalInformation.saturatedFat}
            unit="g"
          />
          <NutritionItem
            label="Gordura monoinsaturada"
            value={nutritionalInformation.monounsaturatedFat}
            unit="g"
          />
          <NutritionItem
            label="Gordura poliinsaturada"
            value={nutritionalInformation.polyunsaturatedFat}
            unit="g"
          />
          <NutritionItem
            label="Gordura trans"
            value={nutritionalInformation.transFat}
            unit="g"
          />
        </>
      </div>
    </div>
  );
}
