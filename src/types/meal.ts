export type MealType =
  | "BREAKFAST"
  | "BRUNCH"
  | "LUNCH"
  | "AFTERNOON_SNACK"
  | "DINNER"
  | "SUPPER"
  | "SNACK"
  | "PRE_WORKOUT"
  | "POST_WORKOUT"
  | "MIDNIGHT_SNACK";

export interface Meal {
  id: string;
  title: string;
  description: string;
  type: MealType;
}
