import { getMealLogMeals } from "@/api/get-meal-log-meals";
import { MealCard } from "@/pages/meals/components/meal-card";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { MealLogMealsSkeleton } from "./meal-log-meals-skeleton";

type MealLogMealsProps = {
  mealLogId: string;
};

export function MealLogMeals({ mealLogId }: MealLogMealsProps) {
  const navigate = useNavigate();

  const { data: mealLogMeals, isLoading: isMealLogMealsLoading } = useQuery({
    queryKey: ["mealLogMeals"],
    queryFn: () => getMealLogMeals(mealLogId),
  });

  if (isMealLogMealsLoading) {
    return <MealLogMealsSkeleton />;
  }

  function openMealDetails(mealId: string) {
    navigate(`/meals/${mealId}`, {
      state: { backUrl: `/meal-logs/${mealLogId}` },
    });
  }

  return (
    <div>
      <h2 className="text-xl mt-4 font-semibold">Lista de Refeição</h2>
      {!mealLogMeals && (
        <p className="text-muted-foreground text-sm">
          Nenhuma refeição encontrada.
        </p>
      )}
      {mealLogMeals &&
        mealLogMeals.length > 0 &&
        mealLogMeals.map((meal) => (
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
