import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { MealNotFoundError } from "./errors/meal-not-found-error";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MealInfo } from "./components/meal-info";
import { MealNutritionalInformation } from "./components/meal-nutritional-information";
import { MealFoods } from "./components/meal-foods";

export function MealDetails() {
  const navigate = useNavigate();
  const { mealId } = useParams<{ mealId: string }>();

  if (!mealId || !z.string().uuid().safeParse(mealId).success) {
    throw new MealNotFoundError();
  }

  function handleBackToMealsPage() {
    navigate("/meals");
  }

  return (
    <div className="container mx-auto px-8 py-6 max-w-2xl">
      <div className="flex items-center justify-start gap-2 mb-4">
        <Button
          type="button"
          className="hover:bg-transparent"
          onClick={handleBackToMealsPage}
          variant="ghost"
          size="icon"
        >
          <ChevronLeftIcon className="translate-y-[2px]" />
        </Button>
        <h1 className="text-2xl font-bold">Visualizar Refeição</h1>
      </div>
      <Separator className="my-4 bg-muted-foreground" />
      <MealInfo mealId={mealId} />
      <MealNutritionalInformation mealId={mealId} />
      <MealFoods mealId={mealId} />
    </div>
  );
}
