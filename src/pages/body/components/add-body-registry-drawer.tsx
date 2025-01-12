import { createBody } from "@/api/create-body";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { queryClient } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon, Loader2 } from "lucide-react";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AddBodyRegistryDrawerProps = {
  children: ReactNode;
};

const addBodyRegistrySchema = z.object({
  weight: z
    .number({
      message: "Peso deve ser um número.",
      coerce: true,
    })
    .min(0, "O peso não deve ser zero.")
    .positive({ message: "Peso deve ser um número positivo." }),
  height: z
    .number({
      message: "Altura deve ser um número.",
      coerce: true,
    })
    .positive({ message: "Altura deve ser um número positivo." })
    .min(0.5, "Altura mínima é 0.5m.")
    .max(3.0, "Altura máxima é 3m."),
  date: z
    .date({ message: "Selecione a data de registro." })
    .max(new Date(), "A data de registro deve estar no passado."),
});

type AddBodyRegistrySchema = z.infer<typeof addBodyRegistrySchema>;

export function AddBodyRegistryDrawer({
  children,
}: AddBodyRegistryDrawerProps) {
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting, errors },
  } = useForm<AddBodyRegistrySchema>({
    resolver: zodResolver(addBodyRegistrySchema),
  });

  const { mutateAsync: addBodyRegistry } = useMutation({
    mutationFn: createBody,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["bodies"] });
      queryClient.refetchQueries({ queryKey: ["goal"] });
      queryClient.refetchQueries({ queryKey: ["latestBody"] });
      queryClient.refetchQueries({ queryKey: ["diagnosis"] });
    },
  });

  async function handleAddBodyRegistry(data: AddBodyRegistrySchema) {
    try {
      await addBodyRegistry({
        date: format(data.date, "yyyy-MM-dd"),
        weight: data.weight,
        height: data.height,
      });

      toast.success("Registro do corpo adicionado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error(
        "Erro ao adicionar registro do corpo. Tente novamente mais tarde."
      );
    } finally {
      setOpen(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <form onSubmit={handleSubmit(handleAddBodyRegistry)}>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Adicionar Registro</DrawerTitle>
              <DrawerDescription>
                Adicione um novo registro do seu corpo.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
