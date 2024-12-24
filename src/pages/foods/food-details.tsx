import { useLocation, useNavigate, useParams } from "react-router";
import { FoodInfo } from "./components/food-info";
import { FoodMeals } from "./components/food-meals";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Menu, Pencil, Trash } from "lucide-react";
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

export function FoodDetails() {
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/foods";
  const navigate = useNavigate();
  const { foodId } = useParams<{ foodId: string }>();

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

  function handleDelete() {
    // TODO: Implement delete food
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
          <h1 className="text-2xl font-bold text-nowrap">Visualizar Comida</h1>
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
              <Button
                onClick={handleDelete}
                className="w-full justify-start"
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Excluir Comida
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

      <Separator className="my-4 bg-muted-foreground" />
      <FoodInfo foodId={foodId} />
      <div className="mt-6">
        <FoodMeals foodId={foodId} />
      </div>
    </div>
  );
}
