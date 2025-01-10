import { getMealLogs, MealLog } from "@/api/get-meal-logs";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Bell, CirclePlus, Menu, Pencil } from "lucide-react";
import { MealLogItem } from "./meal-log-item";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  getMealLogPreferences,
  GetMealLogPreferencesResponse,
} from "@/api/get-meal-log-preferences";
import { DailyMealLogSkeleton } from "./daily-meal-log-skeleton";
import { format } from "date-fns";
import { AddMealLogDrawer } from "./add-meal-log-drawer";

type DailyMealLogProps = {
  date: Date;
};

export function DailyMealLog({ date }: DailyMealLogProps) {
  const navigate = useNavigate();

  const {
    data: mealLogPreferences,
    isLoading: isLoadingMealLogPreferences,
    error: mealLogPreferencesError,
  } = useQuery({
    queryKey: ["meal-log-preferences"],
    queryFn: getMealLogPreferences,
    staleTime: 15 * 60 * 1000,
  });

  const {
    data: mealLogs,
    isLoading: isLoadingMealLogs,
    error: mealLogsError,
  } = useQuery({
    queryKey: ["meal-logs", date],
    queryFn: () => {
      const formattedDate = format(date, "yyyy-MM-dd");
      return getMealLogs({ date: formattedDate });
    },
  });

  if (isLoadingMealLogPreferences || isLoadingMealLogs) {
    return <DailyMealLogSkeleton />;
  }

  if (!mealLogPreferences) throw mealLogPreferencesError;

  if (mealLogsError) throw mealLogsError;

  const itemsToRender: React.ReactNode[] = renderItems(
    mealLogPreferences,
    mealLogs,
    (mealLogId: string) => {
      navigate(`meal-logs/${mealLogId}`);
    }
  );

  function handleEditMealLogPreferences() {
    navigate("/meal-log-preferences/edit");
  }

  return (
    <section id="meal-log">
      <div className="flex items-center justify-between mt-4">
        <h2 className="font-semibold text-lg">Refeições</h2>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Opções</DrawerTitle>
              <DrawerDescription>
                Escolha uma ação para o diário de Refeições.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <Button
                onClick={handleEditMealLogPreferences}
                className="w-full justify-start"
                variant="outline"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar refeições preferidas do diário
              </Button>
              <AddMealLogDrawer date={date}>
                <Button className="w-full justify-start" variant="outline">
                  <CirclePlus className="mr-2 h-4 w-4" />
                  Adicionar registro de refeição ao diário
                </Button>
              </AddMealLogDrawer>
              <Button
                className="w-full justify-start"
                variant="outline"
                disabled
              >
                <Bell className="mr-2 h-4 w-4" />
                Adicionar lembrete de refeição
              </Button>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="mt-2 space-y-4 mb-8 w-full">{itemsToRender}</div>
    </section>
  );
}

function renderItems(
  mealLogPreferences: GetMealLogPreferencesResponse,
  mealLogs: MealLog[] | undefined,
  onClickInMealLog: (mealLogId: string) => void
) {
  const mealLogTypes = mealLogs ? mealLogs.map((mealLog) => mealLog.type) : [];

  const filteredPreferences = mealLogPreferences.filter(
    (pref) => !mealLogTypes.includes(pref.type)
  );

  return [
    ...filteredPreferences.map((mealLog) => (
      <MealLogItem
        key={mealLog.id}
        type={mealLog.type}
        time={mealLog.time}
        isFromPreferences
        caloriesConsumed={0}
        caloriesGoal={mealLog.caloriesGoal}
      />
    )),
    ...(mealLogs
      ? mealLogs.map((mealLog) => (
          <MealLogItem
            key={mealLog.id}
            onClick={() => onClickInMealLog(mealLog.id)}
            type={mealLog.type}
            time={mealLog.time}
            caloriesConsumed={mealLog.caloriesConsumed ?? 0}
            caloriesGoal={mealLog.caloriesGoal}
          />
        ))
      : []),
  ];
}
