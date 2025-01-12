import { api } from "@/lib/axios";

export interface GetDiagnosisResponse {
  bmi: {
    value: number;
    classification: string;
  };
  idealMinimumWeight: number;
  idealMaximumWeight: number;
  fatRate: string;
}

export async function getDiagnosis(): Promise<GetDiagnosisResponse> {
  const response = await api.get<GetDiagnosisResponse>("/v1/me/diagnosis");

  return response.data;
}
