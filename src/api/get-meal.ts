import { api } from "@/lib/axios";
import { Food } from "@/types/food";
import { Meal } from "@/types/meal";

export interface GetMealQuery {
  mealId: string;
}

export interface GetMealResponse extends Meal {
  foods: Food[];
}

export async function getMeal({ mealId }: GetMealQuery): Promise<GetMealResponse> {
  const response = await api.get<GetMealResponse>(`/v1/meals/${mealId}`);

  return response.data;
}
