import { api } from "@/lib/axios";
import { Macronutrient } from "@/types/macronutrient";

export type GetDailyProgressQuery = {
  date?: string;
};

export interface GetDailyProgressResponse {
  macronutrientsTarget: Macronutrient;
  macronutrientsConsumed: Macronutrient;
  targetCalories: number;
  caloriesConsumed: number;
  waterIntakeTarget: number;
  waterIngested: number;
}

export async function getDailyProgress({
  date,
}: GetDailyProgressQuery): Promise<GetDailyProgressResponse> {
  const response = await api.get<GetDailyProgressResponse>(
    "/v1/progress/daily",
    {
      params: {
        date,
      },
    }
  );

  return response.data;
}
