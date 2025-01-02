import { api } from "@/lib/axios";
import { MealType } from "@/types/meal";

export type GetMealLogsQuery = {
  date?: string;
};

interface MealLog {
  id: string;
  type: MealType;
  time: string;
  caloriesGoal: number;
  caloriesConsumed: number;
}

export interface GetMealLogsResponse {
  mealLogs: MealLog[];
}

export async function getMealLogs({
  date,
}: GetMealLogsQuery): Promise<GetMealLogsResponse> {
  const response = await api.get<GetMealLogsResponse>("/v1/meal-logs", {
    params: {
      date,
    },
  });

  return response.data;
}
