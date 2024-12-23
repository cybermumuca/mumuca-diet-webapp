import { Controller, useFormContext } from "react-hook-form";
import { CreateMealSchema } from "./add-meal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mealTypeOptions = [
  { value: "BREAKFAST", label: "Café da Manhã" },
  { value: "BRUNCH", label: "Brunch" },
  { value: "LUNCH", label: "Almoço" },
  { value: "AFTERNOON_SNACK", label: "Lanche da Tarde" },
  { value: "DINNER", label: "Jantar" },
  { value: "SUPPER", label: "Ceia" },
  { value: "SNACK", label: "Lanche" },
  { value: "PRE_WORKOUT", label: "Pré-Treino" },
  { value: "POST_WORKOUT", label: "Pós-Treino" },
  { value: "MIDNIGHT_SNACK", label: "Lanche da Madrugada" },
];

export function MealBasicInformationStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateMealSchema>();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Informações básicas</h2>
      <div>
        <Label htmlFor="title" className="text-lg">
          Nome da Refeição
        </Label>
        <Input
          id="title"
          className={`${
            errors.title ? "border-red-500 dark:border-red-700" : ""
          } placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600`}
          placeholder="Almoço da vovó"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.title?.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="description" className="text-lg">
          Descrição{" "}
          <span className="text-sm text-green-600 dark:text-green-400">
            (Opcional)
          </span>
        </Label>
        <Input
          id="description"
          placeholder='Refeição feita com muito amor. "Quer mais?"'
          className="placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
          {...register("description")}
        />
      </div>

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
                  errors.mealType ? "border-red-500 dark:border-red-700" : ""
                }
              >
                <SelectValue placeholder="Selecione o tipo de refeição" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {mealTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.mealType && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.mealType.message}
          </p>
        )}
      </div>
    </div>
  );
}
