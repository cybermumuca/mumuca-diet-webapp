import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { CreateFoodSchema } from "./add-food";

export function FoodBasicInformationStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateFoodSchema>();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Informações básicas</h2>
      <div>
        <Label htmlFor="title" className="text-lg">
          Nome da comida
        </Label>
        <Input
          id="title"
          className={`${
            errors.title ? "border-red-500 dark:border-red-700" : ""
          } placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600`}
          placeholder="Pão de forma"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 dark:border-red-700 text-xs">
            {errors.title?.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="brand" className="text-lg">
          Marca{" "}
          <span className="text-sm text-green-600 dark:text-green-400">
            (Opcional)
          </span>
        </Label>
        <Input
          id="brand"
          placeholder="Plus Vita"
          className="placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
          {...register("brand")}
        />
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
          placeholder="Macio e saboroso, perfeito para lanches rápidos."
          className="placeholder:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
          {...register("description")}
        />
      </div>
    </div>
  );
}
