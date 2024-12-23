export class MealNotFoundError extends Error {
  constructor(message = "Meal not found") {
    super(message);
    this.name = "MealNotFoundError";
  }
}
