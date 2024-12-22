import { Button } from "@/components/ui/button";
import { useNavigate, useRouteError } from "react-router";
import { FoodNotFoundError } from "./errors/food-not-found-error";
import { ErrorBoundary } from "../boundaries/error-boundary";

export function FoodNotFound() {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  function goToFoodsPage() {
    navigate("/foods", {
      replace: true,
    }); 
  }

  if (error instanceof FoodNotFoundError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold text-nowrap">
          Comida não encontrada
        </h1>
        <p className="text-center font-semibold text-accent-foreground">
          Hmm... Essa comida aí não existe!
        </p>
        <Button onClick={goToFoodsPage}>Ver comidas</Button>
      </div>
    );
  }

  return <ErrorBoundary />;
}
