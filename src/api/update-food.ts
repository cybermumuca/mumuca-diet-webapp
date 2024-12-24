import { api } from "@/lib/axios";
import { Food, Unit } from "@/types/food";

export interface UpdateFoodNutritionalInformation {
  calories?: number;
  carbohydrates?: number;
  protein?: number;
  fat?: number;
  monounsaturatedFat?: number;
  saturatedFat?: number;
  polyunsaturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  potassium?: number;
  fiber?: number;
  sugar?: number;
  calcium?: number;
  iron?: number;
  vitaminA?: number;
  vitaminC?: number;
}
export interface UpdateFoodPortion {
  amount: number;
  unit: Unit;
  description?: string;
}

export interface UpdateFoodBody {
  title: string;
  brand?: string;
  description?: string;
  portion: UpdateFoodPortion;
  nutritionalInformation: UpdateFoodNutritionalInformation;
}

export async function updateFood(foodId: string, food: UpdateFoodBody): Promise<Food> {
  const response = await api.put<Food>(`/v1/foods/${foodId}`, food);

  return response.data;
}
