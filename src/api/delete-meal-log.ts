import { api } from "@/lib/axios";

export async function deleteMealLog(mealLogId: string) {
  await api.delete(`/v1/meal-logs/${mealLogId}`);
}
