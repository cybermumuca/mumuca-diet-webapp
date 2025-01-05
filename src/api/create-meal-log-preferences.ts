import { api } from "@/lib/axios";
import { MealType } from "@/types/meal";

type CreateMealLogPreferencesBody = {
  type: MealType;
  time: string;
}[];

export interface CreateMealLogPreferencesResponse {
  id: string;
  type: MealType;
  time: string;
  caloriesGoal: number;
}

export async function createMealLogPreferences(
  data: CreateMealLogPreferencesBody
): Promise<CreateMealLogPreferencesResponse> {
  const response = await api.post<CreateMealLogPreferencesResponse>(
    "/v1/meal-log-preferences",
    data
  );

  return response.data;
}
