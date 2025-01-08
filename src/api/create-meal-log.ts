import { api } from "@/lib/axios";
import { MealType } from "@/types/meal";

export type CreateMealLogBody = {
  date: string;
  type: MealType;
  time: string;
  caloriesGoal: number;
};

export interface CreateMealLogResponse {
  id: string;
  type: MealType;
  date: string;
  time: string;
  caloriesGoal: number;
}

export async function createMealLog(
  data: CreateMealLogBody
): Promise<CreateMealLogResponse> {
  const response = await api.post<CreateMealLogResponse>("/v1/meal-logs", data);

  return response.data;
}
