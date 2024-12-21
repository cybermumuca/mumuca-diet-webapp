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

export type Unit =
  | "GRAM"               // Gramas
  | "MILLIGRAM"          // Miligramas
  | "KILOGRAM"           // Quilogramas
  | "MICROGRAM"          // Microgramas
  | "MILLILITER"         // Mililitros
  | "LITER"              // Litros
  | "CALORIE"            // Calorias (kcal)
  | "KILOJOULE"          // Quilojoules (kJ)
  | "INTERNATIONAL_UNIT" // Unidades Internacionais (IU)
  | "OUNCE"              // Onças (oz)
  | "CUP"                // Xícaras
  | "TABLESPOON"         // Colheres de Sopa
  | "TEASPOON"           // Colheres de Chá
  | "SLICE"              // Fatias
  | "PIECE"              // Peças
  | "BOWL";              // Tigelas

export interface Portion {
  id: string;
  amount: number;
  unit: Unit;
  description: string | null;
}

export interface Food {
  id: string;
  title: string;
  brand: string | null;
  description: string | null;
  portion: Portion;
  nutritionalInformation: NutritionalInformation;
}
