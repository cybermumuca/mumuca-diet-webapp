import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { CreateFoodSchema } from "./add-food";

const nutritionalFields = [
  { name: "calories", label: "Calorias" },
  { name: "carbohydrates", label: "Carboidratos (g)" },
  { name: "protein", label: "Proteína (g)" },
  { name: "fat", label: "Gordura (g)" },
  { name: "monounsaturatedFat", label: "Gordura Monoinsaturada (g)" },
  { name: "saturatedFat", label: "Gordura Saturada (g)" },
  { name: "polyunsaturatedFat", label: "Gordura Poliinsaturada (g)" },
  { name: "transFat", label: "Gordura Trans (g)" },
  { name: "cholesterol", label: "Colesterol (mg)" },
  { name: "sodium", label: "Sódio (mg)" },
  { name: "potassium", label: "Potássio (mg)" },
  { name: "fiber", label: "Fibra (g)" },
  { name: "sugar", label: "Açúcar (g)" },
  { name: "calcium", label: "Cálcio (mg)" },
  { name: "iron", label: "Ferro (mg)" },
  { name: "vitaminA", label: "Vitamina A (IU)" },
  { name: "vitaminC", label: "Vitamina C (mg)" },
] as const;

export function FoodNutritionalInformationStep() {
  const { register } = useFormContext<CreateFoodSchema>();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Informações nutricionais</h2>
      <div className="flex flex-col gap-4">
        {nutritionalFields.map((field) => (
          <div key={field.name}>
            <Label
              htmlFor={`nutritionalInformation.${field.name}`}
              className="text-lg"
            >
              {field.label}
            </Label>
            <Input
              id={`nutritionalInformation.${field.name}`}
              type="text"
              defaultValue={0}
              {...register(`nutritionalInformation.${field.name}`, {
                valueAsNumber: true,
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
