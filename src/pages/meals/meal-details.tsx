import { useLocation, useNavigate, useParams } from "react-router";
import { z } from "zod";
import { MealNotFoundError } from "./errors/meal-not-found-error";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Menu, Pencil, Trash } from "lucide-react";
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

export function MealDetails() {
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/meals";
  const navigate = useNavigate();
  const { mealId } = useParams<{ mealId: string }>();

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

  function handleDelete() {
    // TODO: Implement delete meal
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
              <Button
                onClick={handleDelete}
                className="w-full justify-start"
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Excluir Refeição
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
      <MealInfo mealId={mealId} />
      <MealNutritionalInformation mealId={mealId} />
      <MealFoods mealId={mealId} />
    </div>
  );
}
