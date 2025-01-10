import { api } from "@/lib/axios";
import { MealType } from "@/types/meal";

export type UpdateMealLogBody = {
  date: string;
  type: MealType;
  time: string;
  caloriesGoal: number;
};

export async function updateMealLog(mealLogId: string, data: UpdateMealLogBody) {
  await api.put(`/v1/meal-logs/${mealLogId}`, data);
}