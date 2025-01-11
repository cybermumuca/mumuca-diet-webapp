import { createMealLog } from "@/api/create-meal-log";
import { MealLog } from "@/api/get-meal-logs";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { queryClient } from "@/lib/react-query";
import { MealType } from "@/types/meal";
import { getMealTypeLabel } from "@/utils/get-meal-type-label";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, PlusCircle } from "lucide-react";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type MealLogPreferenceDrawerProps = {
  id: string;
  date: Date;
  type: MealType;
  time: string;
  caloriesGoal: number;
  children: ReactNode;
};

export function MealLogPreferenceDrawer({
  children,
  type,
  date,
  caloriesGoal,
  time,
}: MealLogPreferenceDrawerProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { mutateAsync: addMealLog, isPending: isAddingMealLog } = useMutation({
    mutationFn: createMealLog,
    onSuccess: (newMealLog) => {
      queryClient.setQueryData(["meal-logs", date], (oldData: MealLog[]) => {
        const updatedData = [...(oldData || []), newMealLog];
        return updatedData.sort((a, b) => a.time.localeCompare(b.time));
      });
    },
  });

  async function handleAddMealLog() {
    try {
      const mealLog = await addMealLog({
        time: time,
        type: type as MealType,
        caloriesGoal: caloriesGoal,
        date: format(date, "yyyy-MM-dd"),
      });

      toast.success("Registro de refeição adicionado com sucesso!", {
        action: {
          label: "Visualizar",
          onClick: () => {
            navigate(`/meal-logs/${mealLog.id}`);
          },
        },
      });

      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        "Erro ao adicionar registrar refeição no diário. Tente novamente mais tarde."
      );
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="focus:outline-none focus:ring-0 focus:ring-offset-0">
        <DrawerHeader className="">
          <DrawerTitle>Opções de {getMealTypeLabel(type)}</DrawerTitle>
          <DrawerDescription>
            Escolha uma ação para essa preferência do diário.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={handleAddMealLog}
            disabled={isAddingMealLog}
          >
            {isAddingMealLog ? (
              <>
                <Loader2 className="animate-spin" /> Criando...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar registro de refeição
              </>
            )}
          </Button>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
