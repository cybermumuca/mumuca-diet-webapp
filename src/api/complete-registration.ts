import { api } from "@/lib/axios";
import { ActivityLevel } from "@/types/activity-level";
import { Gender } from "@/types/gender";
import { GoalType } from "@/types/goal-type";

export type CompleteRegistrationBody = {
  weight: number;
  height: number;
  gender: Gender;
  birthDate: Date;
  goal: GoalType;
  targetWeight: number;
  activityLevel: ActivityLevel;
};

export interface CompleteRegistrationResponse {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  goalType: GoalType;
  activityLevel: ActivityLevel;
  targetWeight: number;
  targetCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterIntakeTarget: number;
  deadline: Date;
}

export async function completeRegistration(
  data: CompleteRegistrationBody
): Promise<CompleteRegistrationResponse> {
  const response = await api.post<CompleteRegistrationResponse>(
    "/v1/me/complete-registration",
    data
  );

  return response.data;
}
