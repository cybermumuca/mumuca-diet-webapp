import { api } from "@/lib/axios";

export interface MealLogNutritionalInformation {
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  cholesterol: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  saturatedFat: number;
  monounsaturatedFat: number;
  polyunsaturatedFat: number;
  transFat: number;
}

export async function getMealLogNutritionalInformation(
  mealLogId: string
): Promise<MealLogNutritionalInformation | null> {
  const response = await api.get<MealLogNutritionalInformation>(
    `/v1/meal-logs/${mealLogId}/nutritional-info`
  );

  return response.data;
}
