import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { listFoods } from "@/api/list-foods";
import { FoodCard } from "./components/food-card";

export function Foods() {
  const navigate = useNavigate();

  const { data: foodsData } = useQuery({
    queryKey: ["foods"],
    queryFn: () => listFoods(),
  });

  function openFoodDetails(id: string) {
    navigate(`/foods/${id}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        {foodsData?.content.map((food) => (
          <FoodCard
            key={food.id}
            id={food.id}
            title={food.title}
            brand={food.brand ?? undefined}
            calories={food.nutritionalInformation.calories}
            onClick={openFoodDetails}
          />
        ))}
      </div>
    </div>
  );
}
