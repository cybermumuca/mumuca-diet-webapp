import { api } from "@/lib/axios";
import { Food } from "@/types/food";

export async function getMealLogFoods(
  mealLogId: string
): Promise<Food[] | null> {
  const response = await api.get(`/v1/meal-logs/${mealLogId}/foods`);

  return response.data;
}
