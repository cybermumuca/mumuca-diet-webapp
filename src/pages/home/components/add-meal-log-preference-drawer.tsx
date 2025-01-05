import { createMealLogPreferences } from "@/api/create-meal-log-preferences";
import {
  getMealLogPreferences,
  GetMealLogPreferencesResponse,
} from "@/api/get-meal-log-preferences";
import { InfoPopover } from "@/components/info-popover";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient } from "@/lib/react-query";
import { MealType } from "@/types/meal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AddMealLogPreferenceDrawerProps = {
  children: ReactNode;
};

const mealTypeOptions = [
  { value: "BREAKFAST", label: "Café da Manhã" },
  { value: "BRUNCH", label: "Café da Manhã Tardio" },
  { value: "LUNCH", label: "Almoço" },
  { value: "AFTERNOON_SNACK", label: "Lanche da Tarde" },
  { value: "DINNER", label: "Jantar" },
  { value: "SUPPER", label: "Ceia" },
  { value: "SNACK", label: "Lanche" },
  { value: "PRE_WORKOUT", label: "Pré-Treino" },
  { value: "POST_WORKOUT", label: "Pós-Treino" },
  { value: "MIDNIGHT_SNACK", label: "Lanche da Madrugada" },
];

const addMealLogPreferencesSchema = z.object({
  mealType: z.enum(
    mealTypeOptions.map((option) => option.value) as [string, ...string[]],
    { message: "Selecione um tipo de refeição" }
  ),
  time: z.string().nonempty({ message: "Horário é obrigatório" }),
});

type AddMealLogPreferencesSchema = z.infer<typeof addMealLogPreferencesSchema>;

export function AddMealLogPreferenceDrawer({
  children,
}: AddMealLogPreferenceDrawerProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    watch,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<AddMealLogPreferencesSchema>({
    resolver: zodResolver(addMealLogPreferencesSchema),
  });

  const { data: mealLogPreferences, isLoading: isLoadingMealLogPreferences } =
    useQuery({
      queryKey: ["meal-log-preferences"],
      queryFn: getMealLogPreferences,
      staleTime: 15 * 60 * 1000,
    });

  const { mutateAsync: addMealLogPreference } = useMutation({
    mutationFn: createMealLogPreferences,
    onSuccess: (newMealLogPreference) => {
      queryClient.setQueryData<GetMealLogPreferencesResponse>(
        ["meal-log-preferences"],
        (oldData) => {
          const updatedData = [
            ...(oldData || []),
            ...(newMealLogPreference as unknown as GetMealLogPreferencesResponse),
          ];
          return updatedData.sort((a, b) => a.time.localeCompare(b.time));
        }
      );
    },
  });

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name) clearErrors(name);
    });

    return () => subscription.unsubscribe();
  }, [clearErrors, watch]);

  if (isLoadingMealLogPreferences) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  async function handleAddMealLogPreferences(
    data: AddMealLogPreferencesSchema
  ) {
    try {
      await addMealLogPreference([
        {
          type: data.mealType as MealType,
          time: data.time,
        },
      ]);

      toast.success("Refeição preferida adicionada ao diário com sucesso");
    } catch (error) {
      console.error(error);
      toast.error(
        "Erro ao adicionar refeição preferida ao diário. Tente novamente mais tarde."
      );
    } finally {
      setOpen(false);
      reset();
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <form onSubmit={handleSubmit(handleAddMealLogPreferences)}>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="flex items-center justify-between w-full">
              <div className="invisible lg:hidden">aa</div>
              <div>
                <DrawerTitle>Adicionar Refeição Preferida</DrawerTitle>
                <DrawerDescription>
                  Adicione uma nova refeição preferida ao diário.
                </DrawerDescription>
              </div>
              <InfoPopover content="Calculamos a meta de caloria para sua refeição automaticamente. Ainda é possível alterar mais tarde." />
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div>
                <Label htmlFor="meal-type" className="text-lg">
                  Tipo de Refeição
                </Label>
                <Controller
                  name="mealType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="meal-type"
                        className={
                          errors.mealType
                            ? "border-red-500 dark:border-red-700"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Selecione o tipo de refeição" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {mealTypeOptions.map((option) => {
                          return (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              disabled={mealLogPreferences?.some(
                                ({ type }) => type === option.value
                              )}
                            >
                              {option.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label className="text-lg">Horário</Label>
                <Input
                  {...register("time")}
                  type="time"
                  className={
                    errors.time ? "border-red-500 dark:border-red-700" : ""
                  }
                />
              </div>
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Adicionar"
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="destructive">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
