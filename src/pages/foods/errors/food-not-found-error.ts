export class FoodNotFoundError extends Error {
  constructor(message = "Food not found") {
    super(message);
    this.name = "FoodNotFoundError";
  }
}
