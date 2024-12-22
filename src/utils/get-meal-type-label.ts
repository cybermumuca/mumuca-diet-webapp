import { MealType } from "@/types/meal";

export function getMealTypeLabel(mealType: MealType) {
  switch (mealType) {
    case "BREAKFAST":
      return "Café da manhã";
    case "BRUNCH":
      return "Café da manhã tardio";
    case "LUNCH":
      return "Almoço";
    case "AFTERNOON_SNACK":
      return "Lanche da tarde";
    case "DINNER":
      return "Jantar";
    case "SUPPER":
      return "Ceia";
    case "SNACK":
      return "Lanche";
    case "PRE_WORKOUT":
      return "Pré-treino";
    case "POST_WORKOUT":
      return "Pós-treino";
    case "MIDNIGHT_SNACK":
      return "Lanche da madrugada";
  }
}
