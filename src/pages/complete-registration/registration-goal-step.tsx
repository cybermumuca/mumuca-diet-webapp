import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { CompleteRegistrationSchema } from "./complete-registration";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegistrationGoalStep() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<CompleteRegistrationSchema>();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Objetivos</h2>
      <div>
        <Label htmlFor="targetWeight" className="text-lg">
          Peso alvo <span className="text-sm">(kg)</span>
        </Label>
        <Input
          id="targetWeight"
          className={`${
            errors.targetWeight ? "border-red-500 dark:border-red-700" : ""
          } placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600`}
          placeholder="78"
          {...register("targetWeight")}
        />
        {errors.targetWeight && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.targetWeight?.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="goal" className="text-lg">
          Objetivo
        </Label>
        <Controller
          name="goal"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="goal"
                className={
                  errors.goal ? "border-red-500 dark:border-red-700" : ""
                }
              >
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOSE_WEIGHT">Perder Peso</SelectItem>
                <SelectItem value="MAINTAIN_WEIGHT">Manter Peso</SelectItem>
                <SelectItem value="GAIN_WEIGHT">Ganhar Peso</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.goal && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.goal.message}
          </p>
        )}
      </div>
    </div>
  );
}
