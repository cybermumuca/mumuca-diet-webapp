import { api } from "@/lib/axios";

export interface RemoveFoodsFromMealBody {
  foodIds: string[];
}

export async function removeFoodsFromMeal(
  mealId: string,
  foodsToRemove: RemoveFoodsFromMealBody
): Promise<void> {
  await api.delete(`/v1/meals/${mealId}/foods`, {
    data: foodsToRemove,
  });
}
