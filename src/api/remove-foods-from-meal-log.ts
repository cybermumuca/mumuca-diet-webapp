import { api } from "@/lib/axios";

export type RemoveFoodsFromMealLogBody = {
  foodIds: string[];
};

export async function removeFoodsFromMealLog(
  mealLogId: string,
  data: RemoveFoodsFromMealLogBody
) {
  await api.delete(`/v1/meal-logs/${mealLogId}/foods`, { data });
}
