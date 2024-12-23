import { getMeal } from "@/api/get-meal";
import { useQuery } from "@tanstack/react-query";
import { MealInfoSkeleton } from "./meal-info-skeleton";
import { isAxiosError } from "axios";
import { MealNotFoundError } from "../errors/meal-not-found-error";
import { getMealTypeLabel } from "@/utils/get-meal-type-label";

export type MealInfoProps = {
  mealId: string;
};

export function MealInfo({ mealId }: MealInfoProps) {
  const {
    data: meal,
    isFetching: isFetchingMeal,
    error,
  } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => getMeal({ mealId }),
    staleTime: 1000 * 60 * 15,
    retry: false,
  });

  if (isFetchingMeal) {
    return <MealInfoSkeleton />;
  }

  if (error || !meal) {
    if (error && !isAxiosError(error)) {
      throw error;
    }

    throw new MealNotFoundError();
  }

  const descriptionText = meal.description ? (
    <p className="text-sm break-words whitespace-pre-wrap max-w-full">
      {meal.description}
    </p>
  ) : (
    <p className="text-muted-foreground text-sm">Sem descrição disponível.</p>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">{meal.title}</h1>
      <h2 className="text-muted-foreground font-semibold mb-4">
        {getMealTypeLabel(meal.type)}
      </h2>
      <div className="flex flex-col items-start gap-1 mb-6">
        <h2 className="text-xl font-semibold">Descrição</h2>
        {descriptionText}
      </div>
    </div>
  );
}
