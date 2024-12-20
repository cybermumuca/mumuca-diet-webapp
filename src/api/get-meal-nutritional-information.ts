import { api } from "@/lib/axios";

export interface GetMealNutritionalInformationQuery {
  mealId: string;
}

export interface GetMealNutritionalInformationResponse {
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  monounsaturatedFat: number;
  saturatedFat: number;
  polyunsaturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  potassium: number;
  fiber: number;
  sugar: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
}

export async function getMealNutritionalInformation({
  mealId,
}: GetMealNutritionalInformationQuery): Promise<GetMealNutritionalInformationResponse> {
  const response = await api.get<GetMealNutritionalInformationResponse>(
    `/v1/meals/${mealId}/nutritional-information`
  );

  return response.data;
}
