export interface NutritionalInformation {
  id: string;
  calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  monounsaturatedFat: number;
  saturatedFat: number;
  polyunsaturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  potassium: number;
  fiber: number;
  sugar: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
}

export interface Food {
  id: string;
  title: string;
  brand: string | null;
  description: string | null;
  nutritionalInformation: NutritionalInformation;
}