import { api } from "@/lib/axios";
import { Food } from "@/types/food";

export interface GetFoodQuery {
  foodId: string;
}

export async function getFood({ foodId }: GetFoodQuery): Promise<Food> {
  const response = await api.get<Food>(`/v1/foods/${foodId}`);

  return response.data;
}
