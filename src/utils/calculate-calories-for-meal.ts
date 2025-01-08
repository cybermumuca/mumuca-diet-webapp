import { MealType } from "@/types/meal";

const MEAL_TYPE_PROPORTIONS = new Map<MealType, number>([
  ["BREAKFAST", 0.2], // 20%
  ["BRUNCH", 0.1], // 10%
  ["LUNCH", 0.3], // 30%
  ["AFTERNOON_SNACK", 0.1], // 10%
  ["DINNER", 0.2], // 20%
  ["SUPPER", 0.05], // 5%
  ["SNACK", 0.05], // 5%
  ["PRE_WORKOUT", 0.05], // 5%
  ["POST_WORKOUT", 0.05], // 5%
  ["MIDNIGHT_SNACK", 0.05], // 5%
]);

export function calculateCaloriesForMeal(
  mealType: MealType,
  caloriesGoal: number
) {
  const proportion = MEAL_TYPE_PROPORTIONS.get(mealType) ?? 0;

  return Math.round(caloriesGoal * proportion);
}
