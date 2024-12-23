import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import { CreateFoodSchema } from "./add-food";

const unitTypeOptions = [
  { value: "GRAM", label: "Gramas" },
  { value: "MILLIGRAM", label: "Miligramas" },
  { value: "KILOGRAM", label: "Quilogramas" },
  { value: "MICROGRAM", label: "Microgramas" },
  { value: "MILLILITER", label: "Mililitros" },
  { value: "LITER", label: "Litros" },
  { value: "CALORIE", label: "Calorias (kcal)" },
  { value: "KILOJOULE", label: "Quilojoules (kJ)" },
  { value: "INTERNATIONAL_UNIT", label: "Unidades Internacionais (IU)" },
  { value: "OUNCE", label: "Onças (oz)" },
  { value: "CUP", label: "Xícaras" },
  { value: "TABLESPOON", label: "Colheres de Sopa" },
  { value: "TEASPOON", label: "Colheres de Chá" },
  { value: "SLICE", label: "Fatias" },
  { value: "PIECE", label: "Peças" },
  { value: "BOWL", label: "Tigelas" },
];

export function FoodPortionStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateFoodSchema>();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Porção</h2>
      <div>
        <Label htmlFor="portions" className="text-lg">
          Porções
        </Label>
        <Input
          id="portions"
          className={`${
            errors.portion?.amount ? "border-red-500 dark:border-red-700" : ""
          } placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600`}
          {...register("portion.amount")}
          placeholder="1"
        />
        {errors.portion?.amount && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.portion.amount.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="unit" className="text-lg">
          Unidade
        </Label>
        <Controller
          name="portion.unit"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="unit"
                className={
                  errors.portion?.unit
                    ? "border-red-500 dark:border-red-700"
                    : ""
                }
              >
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {unitTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.portion?.unit && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.portion.unit.message}
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
          {...register("portion.description")}
          placeholder="1 fatia de pão (50g)"
          className="placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
        />
      </div>
    </div>
  );
}
