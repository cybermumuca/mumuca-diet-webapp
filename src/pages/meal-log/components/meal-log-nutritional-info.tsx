import { getMealLogNutritionalInformation } from "@/api/get-meal-log-nutritional-information";
import { NutritionItem } from "@/pages/shared/components/nutrition-item";
import { useQuery } from "@tanstack/react-query";
import { MealLogNutritionalInfoSkeleton } from "./meal-log-nutritional-info-skeleton";

type MealLogNutritionalInfoProps = {
  mealLogId: string;
};

export function MealLogNutritionalInfo({
  mealLogId,
}: MealLogNutritionalInfoProps) {
  const { data: nutritionalInfo, isLoading: isNutritionalInfoLoading } =
    useQuery({
      queryKey: ["meal-log-nutritional-info", mealLogId],
      queryFn: () => getMealLogNutritionalInformation(mealLogId),
    });

  if (isNutritionalInfoLoading) {
    return <MealLogNutritionalInfoSkeleton />;
  }

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-xl font-semibold">Tabela nutricional</h2>
        <p className="text-muted-foreground text-sm">
          (soma de todas as refeições e comidas)
        </p>
      </div>
      <div className="bg-muted px-3 py-2 rounded-lg mb-6">
        <>
          <NutritionItem
            label="Calorias"
            value={nutritionalInfo?.calories ?? 0}
            unit="kcal"
          />
          <NutritionItem
            label="Carboidratos"
            value={nutritionalInfo?.carbohydrates ?? 0}
            unit="g"
          />
          <NutritionItem
            label="Proteínas"
            value={nutritionalInfo?.protein ?? 0}
            unit="g"
          />
          <NutritionItem
            label="Gorduras"
            value={nutritionalInfo?.fat ?? 0}
            unit="g"
          />
          <NutritionItem
            label="Fibra"
            value={nutritionalInfo?.fiber ?? 0}
            unit="g"
          />
          <NutritionItem
            label="Açucar"
            value={nutritionalInfo?.sugar ?? 0}
            unit="g"
          />
          <NutritionItem
            label="Sódio"
            value={nutritionalInfo?.sodium ?? 0}
            unit="mg"
          />
          <NutritionItem
            label="Potássio"
            value={nutritionalInfo?.potassium ?? 0}
            unit="mg"
          />
          <NutritionItem
            label="Colesterol"
            value={nutritionalInfo?.cholesterol ?? 0}
            unit="mg"
          />
          <NutritionItem
            label="Cálcio"
            value={nutritionalInfo?.calcium ?? 0}
            unit="mg"
          />
          <NutritionItem
            label="Ferro"
            value={nutritionalInfo?.iron ?? 0}
            unit="mg"
          />
          <NutritionItem
            label="Vitamina A"
            value={nutritionalInfo?.vitaminA ?? 0}
            unit="UI"
          />
          <NutritionItem
            label="Vitamina C"
            value={nutritionalInfo?.vitaminC ?? 0}
            unit="mg"
          />
        </>
      </div>
      <h3 className="text-lg font-semibold mb-2">Gorduras</h3>
      <div className="bg-muted px-3 py-2 rounded-lg">
        <>
          <NutritionItem
            label="Gordura saturada"
            value={nutritionalInfo?.saturatedFat ?? 0}
            unit="g"
          />
          <NutritionItem
            label="Gordura monoinsaturada"
            value={nutritionalInfo?.monounsaturatedFat ?? 0}
            unit="g"
          />
          <NutritionItem
            label="Gordura poliinsaturada"
            value={nutritionalInfo?.polyunsaturatedFat ?? 0}
            unit="g"
          />
          <NutritionItem
            label="Gordura trans"
            value={nutritionalInfo?.transFat ?? 0}
            unit="g"
          />
        </>
      </div>
    </div>
  );
}
