import { useLocation, useNavigate, useParams } from "react-router";
import { FoodInfo } from "./components/food-info";
import { FoodMeals } from "./components/food-meals";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Loader2, Menu, Pencil, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FoodNotFoundError } from "./errors/food-not-found-error";
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
import { deleteFood } from "@/api/delete-food";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
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
import { Helmet } from "react-helmet-async";

export function FoodDetails() {
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/foods";
  const navigate = useNavigate();
  const { foodId } = useParams<{ foodId: string }>();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  if (!foodId || !z.string().uuid().safeParse(foodId).success) {
    throw new FoodNotFoundError();
  }

  function handleBack() {
    navigate(backUrl);
  }

  function handleEdit() {
    navigate(`${location.pathname}/edit`, {
      state: { backUrl: location.pathname },
    });
  }

  const { mutateAsync: removeFood, isPending: isRemovingFood } = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      toast.success("Comida excluída com sucesso!");
      queryClient.removeQueries({ queryKey: ["food", foodId] });
      queryClient.refetchQueries({ queryKey: ["foods"], active: true });
      queryClient.refetchQueries({ queryKey: ["meal"], active: true });
    },
  });

  async function handleDelete() {
    setIsAlertOpen(false);
    try {
      await removeFood({ foodId: foodId! });
      navigate(backUrl);
    } catch (error) {
      console.error(error);
    }
  }

  if (isRemovingFood) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet title="Visualizar Comida" />
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
              Visualizar Comida
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
                  Escolha uma ação para esta comida.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <Button
                  onClick={handleEdit}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar Comida
                </Button>
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full justify-start"
                      variant="destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Excluir Comida
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        A comida será excluída permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Excluir comida
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
        <FoodInfo foodId={foodId} />
        <div className="mt-6">
          <FoodMeals foodId={foodId} />
        </div>
      </div>
    </>
  );
}
