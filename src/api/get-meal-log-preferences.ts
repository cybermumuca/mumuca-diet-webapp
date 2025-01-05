import { api } from "@/lib/axios";
import { MealType } from "@/types/meal";

export type GetMealLogPreferencesResponse = {
  id: string;
  type: MealType;
  time: string;
  caloriesGoal: number;
}[];

export async function getMealLogPreferences(): Promise<GetMealLogPreferencesResponse> {
  const response = await api.get<GetMealLogPreferencesResponse>(
    "/v1/meal-log-preferences"
  );

  return response.data;
}
