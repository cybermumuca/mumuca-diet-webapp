import { api } from "@/lib/axios";
import { ActivityLevel } from "@/types/activity-level";
import { Gender } from "@/types/gender";

export interface GetProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  photoUrl: string | null;
  activityLevel: ActivityLevel;
  age: number;
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get<GetProfileResponse>("/v1/me/profile");

  return response.data;
}
