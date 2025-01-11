import { getMealLogFoods } from "@/api/get-meal-log-foods";
import { FoodCard } from "@/pages/foods/components/food-card";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { MealLogFoodsSkeleton } from "./meal-log-foods-skeleton";

type MealLogInfoProps = {
  mealLogId: string;
};

export function MealLogFoods({ mealLogId }: MealLogInfoProps) {
  const navigate = useNavigate();
  
  const { data: mealLogFoods, isLoading: isMealLogFoodsLoading } = useQuery({
    queryKey: ["mealLogFoods", mealLogId],
    queryFn: () => getMealLogFoods(mealLogId),
  });

  if (isMealLogFoodsLoading) {
    return <MealLogFoodsSkeleton />;
  }

  function openFoodDetails(foodId: string) {
    navigate(`/foods/${foodId}`, {
      state: { backUrl: `/meal-logs/${mealLogId}` },
    });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6">Lista de Comidas</h2>
      {!mealLogFoods && (
        <p className="text-muted-foreground text-sm">
          Nenhuma comida encontrada.
        </p>
      )}
      {mealLogFoods &&
        mealLogFoods.length > 0 &&
        mealLogFoods.map((food) => (
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
