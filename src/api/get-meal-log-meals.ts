import { api } from "@/lib/axios";
import { Food } from "@/types/food";
import { MealType } from "@/types/meal";

export interface GetMealLogMealsResponse {
  id: string;
  title: string;
  description: string | null;
  type: MealType;
  foods: Food[];
}

export async function getMealLogMeals(
  mealLogId: string
): Promise<GetMealLogMealsResponse[] | null> {
  const response = await api.get(`/v1/meal-logs/${mealLogId}/meals`);

  return response.data;
}
