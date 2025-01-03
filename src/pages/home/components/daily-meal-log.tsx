import { GetMealLogsResponse } from "@/api/get-meal-logs";
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

type DailyMealLogProps = {
  date: Date;
};

const mealLogs: GetMealLogsResponse = {
  mealLogs: [
    {
      id: "1",
      type: "BREAKFAST",
      time: "08:00",
      caloriesGoal: 500,
      caloriesConsumed: 150,
    },
    {
      id: "2",
      type: "LUNCH",
      time: "12:00",
      caloriesGoal: 700,
      caloriesConsumed: 650,
    },
    {
      id: "4",
      type: "SNACK",
      time: "15:00",
      caloriesGoal: 200,
      caloriesConsumed: 240,
    },
    {
      id: "3",
      type: "DINNER",
      time: "19:00",
      caloriesGoal: 600,
      caloriesConsumed: 550,
    },
  ],
};

export function DailyMealLog({ date }: DailyMealLogProps) {
  function handleEditMealLogPreferences() {
    console.log("Edit meal log preferences");
  }

  function handleAddMealLog() {
    console.log("Add meal log");
  }

  return (
    <div>
      <div className="flex items-center justify-between mt-4">
        <h2 className="font-semibold text-lg">Refeições</h2>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size={"icon"} className="">
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
              <Button
                onClick={handleAddMealLog}
                className="w-full justify-start"
                variant="outline"
              >
                <CirclePlus className="mr-2 h-4 w-4" />
                Adicionar refeição ao diário
              </Button>
              <Button
                onClick={handleAddMealLog}
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
      <div className="mt-2 space-y-4 mb-8 w-full">
        {mealLogs.mealLogs.map((mealLog) => {
          return (
            <MealLogItem
              key={mealLog.id}
              type={mealLog.type}
              time={mealLog.time}
              caloriesConsumed={mealLog.caloriesConsumed}
              caloriesGoal={mealLog.caloriesGoal}
            />
          );
        })}
      </div>
    </div>
  );
}
