import { useLocation, useNavigate, useParams } from "react-router";
import { FoodInfo } from "./components/food-info";
import { FoodMeals } from "./components/food-meals";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FoodNotFoundError } from "./errors/food-not-found-error";

export function FoodDetails() {
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/foods";
  const navigate = useNavigate();
  const { foodId } = useParams<{ foodId: string }>();

  if (!foodId || !z.string().uuid().safeParse(foodId).success) {
    throw new FoodNotFoundError();
  }

  function handleBack() {
    navigate(backUrl);
  }

  return (
    <div className="container mx-auto px-8 py-6 max-w-2xl">
      <div className="flex items-center justify-start gap-2 mb-4">
        <Button
          type="button"
          className="hover:bg-transparent"
          onClick={handleBack}
          variant="ghost"
          size="icon"
        >
          <ChevronLeftIcon className="translate-y-[2px]" />
        </Button>
        <h1 className="text-2xl font-bold">Visualizar Comida</h1>
      </div>
      <Separator className="my-4 bg-muted-foreground" />
      <FoodInfo foodId={foodId} />
      <div className="mt-6">
        <FoodMeals foodId={foodId} />
      </div>
    </div>
  );
}
