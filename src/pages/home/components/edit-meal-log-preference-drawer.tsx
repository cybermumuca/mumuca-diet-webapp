import { deleteMealLogPreference } from "@/api/delete-meal-log-preference";
import {
  getMealLogPreferences,
  GetMealLogPreferencesResponse,
} from "@/api/get-meal-log-preferences";
import {
  updateMealLogPreference,
  UpdateMealLogPreferenceBody,
} from "@/api/update-meal-log-preference";
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
import { getMealTypeLabel } from "@/utils/get-meal-type-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type EditMealLogPreferenceDrawerProps = {
  id: string;
  type: MealType;
  time: string;
  caloriesGoal: number;
  children: ReactNode;
};

const editMealLogPreferenceSchema = z.object({
  type: z.enum([
    "BREAKFAST",
    "BRUNCH",
    "LUNCH",
    "AFTERNOON_SNACK",
    "DINNER",
    "SUPPER",
    "SNACK",
    "PRE_WORKOUT",
    "POST_WORKOUT",
    "MIDNIGHT_SNACK",
  ] as [MealType, ...MealType[]]),
  time: z.string().nonempty({ message: "Horário é obrigatório." }),
  caloriesGoal: z
    .number({
      coerce: true,
      message: "Meta de calorias deve ser um número inteiro positivo.",
    })
    .int({ message: "Meta de calorias deve ser um número inteiro positivo." })
    .min(1, {
      message: "Meta de calorias deve ser um número inteiro positivo.",
    }),
});

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

type EditMealLogPreferenceSchema = z.infer<typeof editMealLogPreferenceSchema>;

export function EditMealLogPreferenceDrawer({
  children,
  id: mealLogId,
  type,
  time,
  caloriesGoal,
}: EditMealLogPreferenceDrawerProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<EditMealLogPreferenceSchema>({
    resolver: zodResolver(editMealLogPreferenceSchema),
    defaultValues: {
      type,
      time,
      caloriesGoal,
    },
  });

  const {
    data: mealLogPreferences,
    isLoading: isLoadingMealLogPreferences,
    error,
  } = useQuery({
    queryKey: ["meal-log-preferences"],
    queryFn: getMealLogPreferences,
    staleTime: 15 * 60 * 1000,
  });

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name) clearErrors(name);
    });

    return () => subscription.unsubscribe();
  }, [clearErrors, watch]);

  const {
    mutateAsync: removeMealLogPreference,
    isPending: isRemovingMealLogPreference,
  } = useMutation({
    mutationFn: deleteMealLogPreference,
    onSuccess: (_, deletedMealLogPreferenceId) => {
      queryClient.setQueryData(
        ["meal-log-preferences"],
        (oldData: GetMealLogPreferencesResponse) => {
          return oldData.filter(
            (mealLogPreference) =>
              mealLogPreference.id !== deletedMealLogPreferenceId
          );
        }
      );
    },
  });

  const { mutateAsync: editMealLogPreference } = useMutation({
    mutationFn: (data: UpdateMealLogPreferenceBody) =>
      updateMealLogPreference(mealLogId, data),
    onSuccess: (mealLogEdited) => {
      queryClient.setQueryData(
        ["meal-log-preferences"],
        (oldData: GetMealLogPreferencesResponse) => {
          return (oldData || []).map((mealLogPreference) => {
            if (mealLogPreference.id === mealLogId) {
              return {
                ...mealLogPreference,
                ...mealLogEdited,
              };
            }

            return mealLogPreference;
          });
        }
      );
    },
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

  async function handleEditMealLogPreference(
    data: EditMealLogPreferenceSchema
  ) {
    try {
      await editMealLogPreference(data);
      toast.success("Refeição preferida editada com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error(
        "Erro ao editar refeição preferida. Tente novamente mais tarde."
      );
    } finally {
      setOpen(false);
    }
  }

  async function handleDeleteMealLogPreference(id: string) {
    try {
      await removeMealLogPreference(id);
      toast.success("Refeição preferida excluída com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error(
        "Erro ao excluir refeição preferida. Tente novamente mais tarde."
      );
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="focus:outline-none focus:ring-0 focus:ring-offset-0">
        <form onSubmit={handleSubmit(handleEditMealLogPreference)}>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="flex items-center justify-center w-full">
              <div>
                <DrawerTitle>Editar {getMealTypeLabel(type)}</DrawerTitle>
                <DrawerDescription>
                  Edite as propriedades de{" "}
                  {getMealTypeLabel(type).toLocaleLowerCase()}.
                </DrawerDescription>
              </div>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div>
                <Label htmlFor="meal-type" className="text-lg">
                  Tipo de Refeição
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id="meal-type"
                        className={
                          errors.type
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
                              disabled={
                                option.value !== type &&
                                mealLogPreferences.some(
                                  (mealLogPreference) =>
                                    mealLogPreference.type === option.value
                                )
                              }
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

              <div>
                <Label className="text-lg">Meta de calorias</Label>
                <Input
                  {...register("caloriesGoal")}
                  type="text"
                  className={
                    errors.caloriesGoal
                      ? "border-red-500 dark:border-red-700"
                      : ""
                  }
                />

                {errors.caloriesGoal && (
                  <p className="text-red-500 dark:border-red-700 text-xs">
                    {errors.caloriesGoal?.message}
                  </p>
                )}
              </div>
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Editar"
                )}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleDeleteMealLogPreference(mealLogId)}
                disabled={isRemovingMealLogPreference}
              >
                {isRemovingMealLogPreference ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Excluir"
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
