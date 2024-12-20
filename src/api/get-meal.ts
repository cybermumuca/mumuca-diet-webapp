import { api } from "@/lib/axios";
import { Meal } from "@/types/meal";

export interface GetMealQuery {
  mealId: string;
}

export async function getMeal({ mealId }: GetMealQuery): Promise<Meal> {
  const response = await api.get<Meal>(`/v1/meals/${mealId}`);

  return response.data;
}
