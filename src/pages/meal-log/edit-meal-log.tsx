import { Button } from "@/components/ui/button";
import { useLocation, useNavigate, useParams } from "react-router";
import { MealLogNotFoundError } from "../home/errors/meal-log-not-found-error";
import { z } from "zod";
import { CalendarIcon, ChevronLeftIcon, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMealLog, GetMealLogResponse } from "@/api/get-meal-log";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { updateMealLog, UpdateMealLogBody } from "@/api/update-meal-log";
import { MealType } from "@/types/meal";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import { Helmet } from "react-helmet-async";

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

const editMealLogSchema = z.object({
  date: z.date({ message: "Data é obrigatória." }),
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

type EditMealLogSchema = z.infer<typeof editMealLogSchema>;

export function EditMealLog() {
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/";
  const navigate = useNavigate();
  const { mealLogId } = useParams<{ mealLogId: string }>();

  if (!mealLogId || !z.string().uuid().safeParse(mealLogId).success) {
    throw new MealLogNotFoundError();
  }

  const { data: mealLog, isLoading: isMealLogLoading } = useQuery({
    queryKey: ["meal-log", mealLogId],
    queryFn: () => getMealLog(mealLogId),
  });

  const { mutateAsync: editMealLog } = useMutation({
    mutationFn: (data: UpdateMealLogBody) => {
      return updateMealLog(mealLogId, data);
    },
    onSuccess: (_, data) => {
      queryClient.refetchQueries({ queryKey: ["meal-logs"] });
      queryClient.setQueryData(
        ["meal-log", mealLogId],
        (oldData: GetMealLogResponse) => {
          return {
            ...oldData,
            ...data,
          };
        }
      );
    },
  });

  const {
    register,
    handleSubmit,
    clearErrors,
    watch,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<EditMealLogSchema>({
    resolver: zodResolver(editMealLogSchema),
  });

  useEffect(() => {
    if (mealLog) {
      setValue("date", dayjs(mealLog.date).toDate());
      setValue("type", mealLog.type);
    }
  }, [mealLog, setValue]);

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name) clearErrors(name);
    });

    return () => subscription.unsubscribe();
  }, [clearErrors, watch]);

  if (isMealLogLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (!mealLog) {
    throw new MealLogNotFoundError();
  }

  function handleBack() {
    navigate(backUrl);
  }

  async function handleEditMealLog(data: EditMealLogSchema) {
    try {
      await editMealLog({
        date: format(data.date, "yyyy-MM-dd"),
        time: data.time,
        type: data.type as MealType,
        caloriesGoal: data.caloriesGoal,
      });

      toast.success("Registro de refeição editado com sucesso.");
      navigate(backUrl);
    } catch (error) {
      console.error(error);
      toast.error(
        "Ocorreu um erro ao editar o registro de refeição. Tente novamente mais tarde."
      );
    }
  }

  return (
    <>
      <Helmet title="Editar Registro de Refeição" />
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
            <h1 className="text-2xl font-bold text-nowrap">Editar Registro</h1>
          </div>
        </div>
        <Separator className="my-4 bg-muted-foreground" />
        <form onSubmit={handleSubmit(handleEditMealLog)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meal-type" className="text-lg">
                Tipo de Refeição
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={mealLog.type}
                  >
                    <SelectTrigger
                      id="meal-type"
                      className={
                        errors.type ? "border-red-500 dark:border-red-700" : ""
                      }
                    >
                      <SelectValue placeholder="Selecione o tipo de refeição" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {mealTypeOptions.map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="">
              <Label htmlFor="date" className="text-lg">
                Data
              </Label>

              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.date && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          dayjs(field.value).format("DD/MM/YYYY")
                        ) : (
                          <span>Selecione a data do registro</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        fixedWeeks
                        initialFocus
                        locale={ptBR}
                        showOutsideDays={false}
                        captionLayout="dropdown"
                        toYear={dayjs(new Date()).year()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-red-500 dark:border-red-700 text-xs">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-lg">Horário</Label>
              <Input
                {...register("time")}
                defaultValue={mealLog.time}
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
                defaultValue={mealLog.caloriesGoal}
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
          <div className="flex flex-col mt-6 gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
