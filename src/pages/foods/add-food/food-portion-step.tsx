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
  { value: "g", label: "Gramas" },
  { value: "mg", label: "Miligramas" },
  { value: "kg", label: "Quilogramas" },
  { value: "mcg", label: "Microgramas" },
  { value: "ml", label: "Mililitros" },
  { value: "l", label: "Litros" },
  { value: "kcal", label: "Calorias (kcal)" },
  { value: "kj", label: "Quilojoules (kJ)" },
  { value: "iu", label: "Unidades Internacionais (IU)" },
  { value: "oz", label: "Onças (oz)" },
  { value: "cup", label: "Xícaras" },
  { value: "tbsp", label: "Colheres de Sopa" },
  { value: "tsp", label: "Colheres de Chá" },
  { value: "slice", label: "Fatias" },
  { value: "piece", label: "Peças" },
  { value: "bowl", label: "Tigelas" },
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
        <Label htmlFor="unity" className="text-lg">
          Unidade
        </Label>
        <Controller
          name="portion.unity"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="unity"
                className={
                  errors.portion?.unity
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
        {errors.portion?.unity && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.portion.unity.message}
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
