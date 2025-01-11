import { getMealLogPreferences } from "@/api/get-meal-log-preferences";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { getMealTypeLabel } from "@/utils/get-meal-type-label";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { AddMealLogPreferenceDrawer } from "../home/components/add-meal-log-preference-drawer";
import { EditMealLogPreferenceDrawer } from "../home/components/edit-meal-log-preference-drawer";

export function EditMealLogPreferences() {
  const navigate = useNavigate();

  const {
    data: mealLogPreferences,
    isLoading: isLoadingMealLogPreferences,
    error,
  } = useQuery({
    queryKey: ["meal-log-preferences"],
    queryFn: getMealLogPreferences,
    staleTime: 15 * 60 * 1000,
  });

  if (isLoadingMealLogPreferences) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!mealLogPreferences) {
    throw error;
  }

  function handleBack() {
    navigate("/");
  }

  const hasMealLogPreferences = mealLogPreferences.length > 0;

  return (
    <div className="container mx-auto px-8 py-6 max-w-2xl relative min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="hover:bg-transparent"
            onClick={handleBack}
            variant="ghost"
            size="icon"
          >
            <ChevronLeftIcon className="translate-y-[2px]" />
          </Button>
          <h1 className="text-xl font-bold text-nowrap">
            Editar Refeições Preferidas
          </h1>
        </div>
      </div>
      <Separator className="my-4 bg-muted-foreground" />
      {mealLogPreferences.map(({ id, type, time, caloriesGoal }) => {
        return (
          <EditMealLogPreferenceDrawer
            key={type}
            id={id}
            time={time}
            type={type}
            caloriesGoal={caloriesGoal}
          >
            <div className="border-[1px] rounded-lg p-4 w-full mb-2 cursor-pointer hover:bg-accent">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{getMealTypeLabel(type)}</h3>
                <span className="text-sm text-muted-foreground">{time}</span>
              </div>
              <div>
                <span className="text-base">Meta: {caloriesGoal} kcal</span>
              </div>
            </div>
          </EditMealLogPreferenceDrawer>
        );
      })}

      {!hasMealLogPreferences && (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Nenhuma refeição preferida encontrada
            </h2>
            <p className="text-muted-foreground mb-4">
              Que tal adicionar a primeira?
            </p>
            <AddMealLogPreferenceDrawer>
              <Button>
                Adicionar refeição preferida
                <Plus className="h-4 w-4" />
              </Button>
            </AddMealLogPreferenceDrawer>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6">
        <AddMealLogPreferenceDrawer>
          <Button size="icon" className="rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </AddMealLogPreferenceDrawer>
      </div>
    </div>
  );
}
