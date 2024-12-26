import { api } from "@/lib/axios";

export interface DeleteFoodParams {
  foodId: string;
}

export async function deleteFood({ foodId }: DeleteFoodParams): Promise<void> {
  const response = await api.delete(`/v1/foods/${foodId}`);

  return response.data;
}
