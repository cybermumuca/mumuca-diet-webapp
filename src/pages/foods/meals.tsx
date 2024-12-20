import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { listMeals } from "@/api/list-meals";
import { MealCard } from "./components/meal-card";
import { Helmet } from "react-helmet-async";

export function Meals() {
  const navigate = useNavigate();

  const { data: mealsData } = useQuery({
    queryKey: ["meals"],
    queryFn: () => listMeals(),
  });

  function openMealDetails(id: string) {
    navigate(`/meals/${id}`);
  }

  return (
    <>
      <Helmet title="Refeições" />
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          {mealsData?.content.map((meal) => (
            <MealCard
              key={meal.id}
              id={meal.id}
              title={meal.title}
              type={meal.type}
              onClick={openMealDetails}
            />
          ))}
        </div>
      </div>
    </>
  );
}
