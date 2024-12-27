import { api } from "@/lib/axios";

export interface AddFoodsToMealBody {
  foodIds: string[];
}

export async function addFoodsToMeal(
  mealId: string,
  foodsToAdd: AddFoodsToMealBody
): Promise<void> {
  await api.patch(`/v1/meals/${mealId}/foods`, foodsToAdd);
}
