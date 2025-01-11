import { api } from "@/lib/axios";

export type RemoveMealsFromMealLogBody = {
  mealIds: string[];
};

export async function removeMealsFromMealLog(
  mealLogId: string,
  data: RemoveMealsFromMealLogBody
) {
  await api.delete(`/v1/meal-logs/${mealLogId}/meals`, { data });
}
