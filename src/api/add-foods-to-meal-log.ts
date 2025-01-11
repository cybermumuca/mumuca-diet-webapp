import { api } from "@/lib/axios";


export type AddFoodsToMealLogBody = {
  foodIds: string[];
}

export async function addFoodsToMealLog(mealLogId: string, data: AddFoodsToMealLogBody) {
  await api.post(`/v1/meal-logs/${mealLogId}/foods`, data);
}