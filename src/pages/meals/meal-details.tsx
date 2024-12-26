import { useLocation, useNavigate, useParams } from "react-router";
import { z } from "zod";
import { MealNotFoundError } from "./errors/meal-not-found-error";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Loader2, Menu, Pencil, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MealInfo } from "./components/meal-info";
import { MealNutritionalInformation } from "./components/meal-nutritional-information";
import { MealFoods } from "./components/meal-foods";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { deleteMeal } from "@/api/delete-meal";
import { useMutation } from "@tanstack/react-query";

export function MealDetails() {
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/meals";
  const navigate = useNavigate();
  const { mealId } = useParams<{ mealId: string }>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  if (!mealId || !z.string().uuid().safeParse(mealId).success) {
    throw new MealNotFoundError();
  }

  function handleBack() {
    navigate(backUrl);
  }

  function handleEdit() {
    navigate(`${location.pathname}/edit`, {
      state: { backUrl: location.pathname },
    });
  }

  const { mutateAsync: removeMeal, isPending: isRemovingMeal } = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      toast.success("Refeição excluída com sucesso!");
      queryClient.removeQueries({ queryKey: ["meal", mealId] });
      queryClient.refetchQueries({ queryKey: ["meals"], active: true });
      queryClient.refetchQueries({ queryKey: ["foodMeals"], active: true });
    },
  });

  async function handleDelete() {
    setIsAlertOpen(false);
    try {
      await removeMeal({ mealId: mealId! });
      navigate(backUrl);
    } catch (error) {
      console.error(error);
    }
  }

  if (isRemovingMeal) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
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
          <h1 className="text-2xl font-bold text-nowrap">
            Visualizar Refeição
          </h1>
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
                Escolha uma ação para esta refeição.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <Button
                onClick={handleEdit}
                className="w-full justify-start"
                variant="outline"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar Refeição
              </Button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full justify-start"
                    variant="destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir Refeição
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      A refeição será excluída permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Excluir refeição
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
      <MealInfo mealId={mealId} />
      <MealNutritionalInformation mealId={mealId} />
      <MealFoods mealId={mealId} />
    </div>
  );
}
