import { Button } from "@/components/ui/button";
import { useNavigate, useRouteError } from "react-router";
import { ErrorBoundary } from "../boundaries/error-boundary";
import { MealNotFoundError } from "./errors/meal-not-found-error";

export function MealNotFound() {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  function goToMealsPage() {
    navigate("/meals", {
      replace: true,
    }); 
  }

  if (error instanceof MealNotFoundError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold text-nowrap">
          Refeição não encontrada
        </h1>
        <p className="text-center font-semibold text-accent-foreground">
          Hmm... Essa refeição aí não existe!
        </p>
        <Button onClick={goToMealsPage}>Ver refeições</Button>
      </div>
    );
  }

  return <ErrorBoundary />;
}