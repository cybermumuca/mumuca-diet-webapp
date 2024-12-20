import { api } from "@/lib/axios";
import { Meal } from "@/types/meal";

export interface GetFoodMealsQuery {
  foodId: string;
}

export async function getFoodMeals({
  foodId,
}: GetFoodMealsQuery): Promise<Meal> {
  const response = await api.get<Meal>(`/v1/foods/${foodId}/meals`);

  return response.data;
}
