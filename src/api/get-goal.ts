import { api } from "@/lib/axios";
import { GoalType } from "@/types/goal-type";
import { Macronutrient } from "@/types/macronutrient";

export interface GetGoalResponse {
  id: string;
  goalType: GoalType;
  targetCalories: number;
  macronutrientsTarget: Macronutrient;
  targetWeight: number;
  waterIntakeTarget: number;
  deadline: string;
}

export async function getGoal(): Promise<GetGoalResponse> {
  const response = await api.get("/v1/goals");

  return response.data;
}
