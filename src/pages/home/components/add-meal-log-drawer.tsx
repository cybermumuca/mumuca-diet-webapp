import { ReactNode, useEffect, useState } from "react";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InfoPopover } from "@/components/info-popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getMealLogs, MealLog } from "@/api/get-meal-logs";
import { createMealLog } from "@/api/create-meal-log";
import { getGoal } from "@/api/get-goal";
import { calculateCaloriesForMeal } from "@/utils/calculate-calories-for-meal";
import { MealType } from "@/types/meal";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { queryClient } from "@/lib/react-query";

type AddMealLogDrawerProps = {
  children: ReactNode;
  date: Date;
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

const addMealLogSchema = z.object({
  type: z.enum(
    mealTypeOptions.map((option) => option.value) as [string, ...string[]],
    { message: "Selecione um tipo de refeição" }
  ),
  time: z.string().nonempty({ message: "Horário é obrigatório" }),
  caloriesGoal: z
    .number({
      coerce: true,
      message: "Meta de calorias deve ser um número inteiro positivo.",
    })
    .int({ message: "Meta de calorias deve ser um número inteiro positivo." })
    .min(1, {
      message: "Meta de calorias deve ser um número inteiro positivo.",
    })
    .max(10000, {
      message: "Meta de calorias deve ser um número inteiro menor que 10000.",
    }),
});

type AddMealLogSchema = z.infer<typeof addMealLogSchema>;

export function AddMealLogDrawer({ children, date }: AddMealLogDrawerProps) {
  const navigate = useNavigate();
  const isToday =
    format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const [open, setOpen] = useState(false);

  const {
    data: userGoal,
    isLoading: isLoadingUserGoal,
    error: userGoalError,
  } = useQuery({
    queryKey: ["goals"],
    queryFn: getGoal,
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    clearErrors,
    watch,
    control,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<AddMealLogSchema>({
    resolver: zodResolver(addMealLogSchema),
  });

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name) clearErrors(name);
    });

    return () => subscription.unsubscribe();
  }, [clearErrors, watch]);

  const mealTypeWatched = useWatch({ control, name: "type" });

  useEffect(() => {
    if (userGoal) {
      setValue(
        "caloriesGoal",
        calculateCaloriesForMeal(
          mealTypeWatched as MealType,
          userGoal.targetCalories
        )
      );
    }
  }, [reset, userGoal, mealTypeWatched, setValue]);

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
    enabled: open,
  });

  const { mutateAsync: addMealLog } = useMutation({
    mutationFn: createMealLog,
    onSuccess: (newMealLog) => {
      queryClient.setQueryData(["meal-logs", date], (oldData: MealLog[]) => {
        const updatedData = [...(oldData || []), newMealLog];
        console.log(updatedData);
        return updatedData.sort((a, b) => a.time.localeCompare(b.time));
      });
    },
  });

  if (isLoadingMealLogs || isLoadingUserGoal) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="flex items-center justify-between w-full">
              <div className="invisible lg:hidden">aa</div>
              <div>
                <DrawerTitle>Adicionar Registro de Refeição</DrawerTitle>
                <DrawerDescription>
                  Adicione um novo registro de refeição ao diário.
                </DrawerDescription>
              </div>
              <InfoPopover
                content={`A refeição será adicionada aos registros do diário do dia de ${
                  isToday ? "hoje" : format(date, "dd/MM/yyyy")
                }.`}
              />
            </DrawerHeader>
          </div>
          <div className="w-full flex h-40 items-center justify-center p-8">
            <Loader2 className="animate-spin w-10 h-10 text-primary" />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (mealLogsError) throw mealLogsError;

  if (userGoalError) throw userGoalError;

  async function handleAddMealLog(data: AddMealLogSchema) {
    try {
      const mealLog = await addMealLog({
        time: data.time,
        type: data.type as MealType,
        caloriesGoal: data.caloriesGoal,
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
      <DrawerContent>
        <form onSubmit={handleSubmit(handleAddMealLog)}>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="flex items-center justify-between w-full">
              <div className="invisible lg:hidden">aa</div>
              <div>
                <DrawerTitle>Adicionar Registro de Refeição</DrawerTitle>
                <DrawerDescription>
                  Adicione um novo registro de refeição ao diário.
                </DrawerDescription>
              </div>
              <InfoPopover
                content={`A refeição será adicionada aos registros do diário do dia de ${
                  isToday ? "hoje" : format(date, "dd/MM/yyyy")
                }.`}
              />
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
                                mealLogs
                                  ? mealLogs.some(
                                      ({ type }) => type === option.value
                                    )
                                  : false
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
                <div className="flex items-center justify-start">
                  <Label className="text-lg">Meta de calorias</Label>
                  <InfoPopover
                    content={`A meta de calorias é calculada automaticamente ao escolher uma refeição.`}
                  />
                </div>
                <Input
                  {...register("caloriesGoal")}
                  type="text"
                  value={watch("caloriesGoal", 0)}
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
