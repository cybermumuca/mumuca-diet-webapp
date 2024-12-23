import { getFoodMeals } from "@/api/get-food-meals";
import { Meal } from "@/types/meal";
import { useQuery } from "@tanstack/react-query";
import { FoodMealsSkeleton } from "./food-meals-skeleton";
import { MealCard } from "./meal-card";
import { useNavigate } from "react-router";

interface FoodMealsProps {
  foodId: string;
}

export function FoodMeals({ foodId }: FoodMealsProps) {
  const navigate = useNavigate();

  const { data: meals, isFetching: isFetchingMealsRelated } = useQuery({
    queryKey: ["foodMeals", foodId],
    queryFn: () => getFoodMeals({ foodId }),
    staleTime: 1000 * 60 * 2,
  });

  // TODO: Add the MealCard Skeleton when it is ready
  if (isFetchingMealsRelated) {
    return <FoodMealsSkeleton />;
  }

  function openMealDetails(mealId: string) {
    navigate(`/meals/${mealId}`);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Refeições incluindo essa comida</h2>
      {meals && meals.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Nenhuma refeição encontrada.
        </p>
      )}
      {meals &&
        meals.length > 0 &&
        meals.map((meal: Meal) => (
          <MealCard
            key={meal.id}
            onClick={() => openMealDetails(meal.id)}
            title={meal.title}
            type={meal.type}
            className="mt-2"
          />
        ))}
    </div>
  );
}
