import { api } from "@/lib/axios";
import { Meal } from "@/types/meal";

export interface UpdateMealBody {
  title: string;
  description?: string;
  mealType: string;
}

export async function updateMeal(
  mealId: string,
  data: UpdateMealBody
): Promise<Meal> {
  const response = await api.put<Meal>(`/v1/meals/${mealId}`, data);

  return response.data;
}
