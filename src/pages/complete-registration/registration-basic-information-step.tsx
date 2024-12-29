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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { InfoPopover } from "@/components/info-popover";
import { ptBR } from "date-fns/locale";

export function RegistrationBasicInformationStep() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<CompleteRegistrationSchema>();

  const activityLevelInfo = (
    <ul className="list-disc pl-4 space-y-1">
      <li>Sedentário: Pouco ou nenhum exercício</li>
      <li>Levemente Ativo: Exercício leve 1-3 vezes por semana</li>
      <li>Moderadamente Ativo: Exercício moderado 3-5 vezes por semana</li>
      <li>Muito Ativo: Exercício intenso 6-7 vezes por semana</li>
      <li>Extremamente Ativo: Exercício muito intenso diariamente</li>
    </ul>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Informações básicas</h2>
      <div>
        <Label htmlFor="weight" className="text-lg">
          Peso <span className="text-sm">(kg)</span>
        </Label>
        <Input
          id="weight"
          className={`${
            errors.weight ? "border-red-500 dark:border-red-700" : ""
          } placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600`}
          placeholder="78"
          {...register("weight")}
        />
        {errors.weight && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.weight?.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="height" className="text-lg">
          Altura <span className="text-sm">(m)</span>
        </Label>
        <Input
          id="height"
          placeholder="1.78"
          className={`${
            errors.height ? "border-red-500 dark:border-red-700" : ""
          } placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600`}
          {...register("height")}
        />
        {errors.height && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.height.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="gender" className="text-lg">
          Gênero
        </Label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="unit"
                className={
                  errors.gender ? "border-red-500 dark:border-red-700" : ""
                }
              >
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Homem</SelectItem>
                <SelectItem value="FEMALE">Mulher</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.gender.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="birthdate" className="text-lg">
            Data de Nascimento
          </Label>
          <InfoPopover content="Sua data de nascimento é usada para calcular sua idade." />
        </div>
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    errors.birthDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    dayjs(field.value).format("DD/MM/YYYY")
                  ) : (
                    <span>Selecione a sua data de nascimento</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  fixedWeeks
                  initialFocus
                  locale={ptBR}
                  showOutsideDays={false}
                  defaultMonth={new Date("2000-02")}
                  captionLayout="dropdown"
                  toYear={dayjs(new Date()).year()}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.birthDate && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.birthDate.message}
          </p>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="activityLevel" className="text-lg">
            Nível de atividade
          </Label>
          <InfoPopover content={activityLevelInfo} />
        </div>
        <Controller
          name="activityLevel"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="activityLevel"
                className={
                  errors.activityLevel
                    ? "border-red-500 dark:border-red-700"
                    : ""
                }
              >
                <SelectValue placeholder="Selecione o nível de atividade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEDENTARY">Sedentário</SelectItem>
                <SelectItem value="LIGHTLY_ACTIVE">Levemente Ativo</SelectItem>
                <SelectItem value="MODERATELY_ACTIVE">
                  Moderadamente Ativo
                </SelectItem>
                <SelectItem value="VERY_ACTIVE">Muito Ativo</SelectItem>
                <SelectItem value="EXTRA_ACTIVE">Extremamente Ativo</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.activityLevel && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.activityLevel.message}
          </p>
        )}
      </div>
    </div>
  );
}
