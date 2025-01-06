import { api } from "@/lib/axios";
import { MealType } from "@/types/meal";

export type UpdateMealLogPreferenceBody = {
  type: MealType;
  time: string;
  caloriesGoal: number;
};

interface UpdateMealLogPreferenceResponse {
  id: string;
  type: MealType;
  time: string;
  caloriesGoal: number;
}

export async function updateMealLogPreference(
  mealLogPreferenceId: string,
  data: UpdateMealLogPreferenceBody
): Promise<UpdateMealLogPreferenceResponse> {
  const response = await api.patch(
    `/v1/meal-log-preferences/${mealLogPreferenceId}`,
    data
  );

  return response.data;
}
