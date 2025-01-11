import { api } from "@/lib/axios";

export type AddMealsToMealLogBody = {
  mealIds: string[];
};

export async function addMealsToMealLog(
  mealLogId: string,
  data: AddMealsToMealLogBody
) {
  await api.post(`/v1/meal-logs/${mealLogId}/meals`, data);
}
