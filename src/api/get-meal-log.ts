import { api } from "@/lib/axios";
import { MealType } from "@/types/meal";

interface GetMealLogResponse {
  id: string;
  type: MealType;
  date: string;
  time: string;
  caloriesGoal: number;
}

export async function getMealLog(
  mealLogId: string
): Promise<GetMealLogResponse> {
  const response = await api.get(`/v1/meal-logs/${mealLogId}`);
  return response.data;
}
