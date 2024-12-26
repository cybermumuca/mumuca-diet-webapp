import { api } from "@/lib/axios";

export interface DeleteMealParams {
  mealId: string;
}

export async function deleteMeal({ mealId }: DeleteMealParams): Promise<void> {
  await api.delete(`/v1/meals/${mealId}`);
}
