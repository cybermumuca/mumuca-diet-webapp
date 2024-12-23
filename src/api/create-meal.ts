import { api } from "@/lib/axios";
import { Meal, MealType } from "@/types/meal";

export interface CreateMealBody {
  title: string;
  description?: string;
  type: MealType;
  foodIds: string[];
}

export async function createMeal(data: CreateMealBody): Promise<Meal> {
  const response = await api.post<Meal>("/v1/meals", data);

  return response.data;
}