import { getMeal } from "@/api/get-meal";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { MealNotFoundError } from "../errors/meal-not-found-error";
import { FoodCard } from "../../foods/components/food-card";
import { useNavigate } from "react-router";
import { MealFoodsSkeleton } from "./meal-foods-skeleton";

export type MealFoodsProps = {
  mealId: string;
};

export function MealFoods({ mealId }: MealFoodsProps) {
  const navigate = useNavigate();
  const {
    data: meal,
    isFetching: isFetchingMeal,
    error,
  } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => getMeal({ mealId }),
    retry: false,
  });

  if (isFetchingMeal) {
    return <MealFoodsSkeleton />;
  }

  if (error || !meal) {
    if (error && !isAxiosError(error)) {
      throw error;
    }

    throw new MealNotFoundError();
  }

  function openFoodDetails(foodId: string) {
    navigate(`/foods/${foodId}`);
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Comidas inclusas nessa Refeição</h1>
      {meal && meal.foods.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Nenhuma refeição encontrada.
        </p>
      )}
      {meal &&
        meal.foods.length > 0 &&
        meal.foods.map((food) => (
          <FoodCard
            key={food.id}
            title={food.title}
            brand={food.brand}
            amount={food.portion.amount}
            unit={food.portion.unit}
            calories={food.nutritionalInformation.calories}
            onClick={() => openFoodDetails(food.id)}
            className="mt-2"
          />
        ))}
    </div>
  );
}
