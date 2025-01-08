import { api } from "@/lib/axios";
import { MealType } from "@/types/meal";

export type GetMealLogsQuery = {
  date?: string;
};

export interface MealLog {
  id: string;
  type: MealType;
  time: string;
  caloriesGoal: number;
  caloriesConsumed: number;
}

export async function getMealLogs({
  date,
}: GetMealLogsQuery): Promise<MealLog[]> {
  const response = await api.get<MealLog[]>("/v1/meal-logs", {
    params: {
      date,
    },
  });

  return response.data;
}
