import { api } from "@/lib/axios";

export async function deleteMealLogPreference(mealLogPreferenceId: string) {
  const response = await api.delete(
    `/v1/meal-log-preferences/${mealLogPreferenceId}`
  );

  return response.data;
}
