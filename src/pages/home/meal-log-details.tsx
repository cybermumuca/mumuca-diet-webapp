import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
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
import { Separator } from "@/components/ui/separator";
import { ChevronLeftIcon, Loader2, Menu, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { MealLogInfo } from "./components/meal-log-info";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { MealLogNotFoundError } from "./errors/meal-log-not-found-error";
import { MealLogNutritionalInfo } from "./components/meal-log-nutritional-info";
import { MealLogFoods } from "./components/meal-log-foods";
import { MealLogMeals } from "./components/meal-log-meals";
import { deleteMealLog } from "@/api/delete-meal-log";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";

export function MealLogDetails() {
  const navigate = useNavigate();
  const { mealLogId } = useParams<{ mealLogId: string }>();

  if (!mealLogId || !z.string().uuid().safeParse(mealLogId).success) {
    throw new MealLogNotFoundError();
  }

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { mutateAsync: removeMealLog, isPending: isRemovingMealLog } =
    useMutation({
      mutationFn: deleteMealLog,
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["meal-logs"], active: true });
        queryClient.removeQueries({ queryKey: ["meal-log", mealLogId] });
      },
    });

  function handleBack() {}
  function handleEdit() {}

  async function handleDelete() {
    try {
      await removeMealLog(mealLogId!);

      toast.success("Registro removido com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível remover o registro de refeição. Tente novamente mais tarde.");
    }
  }

  return (
    <div className="container mx-auto px-8 py-6 max-w-2xl">
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
          <h1 className="text-xl font-bold text-nowrap">Visualizar Registro</h1>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Opções</DrawerTitle>
              <DrawerDescription>
                Escolha uma ação para este registro de refeição.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <Button
                onClick={handleEdit}
                className="w-full justify-start"
                variant="outline"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar registro de refeição
              </Button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full justify-start"
                    disabled={isRemovingMealLog}
                    variant="destructive"
                  >
                    {isRemovingMealLog ? (
                      <>
                        <Loader2 className="animate-spin" />
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir Registro de Refeição
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O registro dessa refeição será excluído permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Excluir registro de refeição
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <Separator className="my-4 bg-muted-foreground" />
      <MealLogInfo mealLogId={mealLogId} />
      <MealLogNutritionalInfo mealLogId={mealLogId} />
      <MealLogFoods mealLogId={mealLogId} />
      <MealLogMeals mealLogId={mealLogId} />
    </div>
  );
}
