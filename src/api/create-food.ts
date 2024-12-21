import { api } from "@/lib/axios";
import { Food } from "@/types/food";

export interface CreateFoodNutritionalInformation {
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

export interface CreateFoodBody {
  title: string;
  brand?: string;
  description?: string;
  nutritionalInformation: CreateFoodNutritionalInformation;
}

export async function createFood(data: CreateFoodBody): Promise<Food> {
  const response = await api.post<Food>("/v1/foods", data);

  return response.data;
}
