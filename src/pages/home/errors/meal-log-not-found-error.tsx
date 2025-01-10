export class MealLogNotFoundError extends Error {
  constructor(message = "Meal Log not found") {
    super(message);
    this.name = "MealLogNotFoundError";
  }
}
