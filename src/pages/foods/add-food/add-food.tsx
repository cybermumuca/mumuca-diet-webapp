import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";

import { createFood } from "@/api/create-food";
import { queryClient } from "@/lib/react-query";
import { FoodBasicInformationStep } from "./food-basic-information-step";
import { FoodPortionStep } from "./food-portion-step";
import { FoodNutritionalInformationStep } from "./food-nutritional-information-step";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/progress-indicator";
import { ChevronLeftIcon, Loader2 } from "lucide-react";

type Step = "basicInfo" | "portions" | "nutritionalInfo";

const steps: Step[] = ["basicInfo", "portions", "nutritionalInfo"];

const createFoodSchema = z.object({
  title: z.string().nonempty("Nome é obrigatório"),
  brand: z.string().optional(),
  description: z.string().optional(),
  portion: z.object({
    amount: z.number({ coerce: true, message: "Deve ser um inteiro positivo" }).positive("A quantidade deve ser maior que zero").default(0),
    unity: z.string({ message: "Escolha uma unidade" }).nonempty("A unidade é obrigatória"),
    description: z.string().optional(),
  }),
  nutritionalInformation: z.object({
    calories: z.number({ coerce: true }).int().default(0).optional(),
    carbohydrates: z.number({ coerce: true }).default(0).optional(),
    protein: z.number({ coerce: true }).default(0).optional(),
    fat: z.number({ coerce: true }).default(0).optional(),
    monounsaturatedFat: z.number({ coerce: true }).default(0).optional(),
    saturatedFat: z.number({ coerce: true }).default(0).optional(),
    polyunsaturatedFat: z.number({ coerce: true }).default(0).optional(),
    transFat: z.number({ coerce: true }).default(0).optional(),
    cholesterol: z.number({ coerce: true }).default(0).optional(),
    sodium: z.number({ coerce: true }).default(0).optional(),
    potassium: z.number({ coerce: true }).default(0).optional(),
    fiber: z.number({ coerce: true }).default(0).optional(),
    sugar: z.number({ coerce: true }).default(0).optional(),
    calcium: z.number({ coerce: true }).default(0).optional(),
    iron: z.number({ coerce: true }).default(0).optional(),
    vitaminA: z.number({ coerce: true }).default(0).optional(),
    vitaminC: z.number({ coerce: true }).default(0).optional(),
  }),
});

export type CreateFoodSchema = z.infer<typeof createFoodSchema>;

export function AddFood() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("basicInfo");

  const methods = useForm<CreateFoodSchema>({
    resolver: zodResolver(createFoodSchema),
  });

  const watchedTitle = useWatch({
    control: methods.control,
    name: "title",
  });

  const watchedPortionAmount = useWatch({
    control: methods.control,
    name: "portion.amount",
  });

  const watchedPortionUnity = useWatch({
    control: methods.control,
    name: "portion.unity",
  });

  useEffect(() => {
    methods.clearErrors("title");
  }, [watchedTitle, methods]);

  useEffect(() => {
    methods.clearErrors("portion.amount");
  }, [watchedPortionAmount, methods]);

  useEffect(() => {
    methods.clearErrors("portion.unity");
  }, [watchedPortionUnity, methods]);

  const { mutateAsync: addFood } = useMutation({
    mutationFn: createFood,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["foods"], active: true });
    },
  });

  async function handleNextStep() {
    const currentIndex = steps.indexOf(step);

    const fieldsToValidate =
      step === "basicInfo"
        ? (["title", "brand", "description"] as const)
        : step === "portions"
        ? (["portion.amount", "portion.unity", "portion.description"] as const)
        : step === "nutritionalInfo"
        ? (
            Object.keys(
              createFoodSchema.shape.nutritionalInformation.shape
            ) as Array<
              keyof typeof createFoodSchema.shape.nutritionalInformation.shape
            >
          ).map((key) => `nutritionalInformation.${key}` as const)
        : [];

    const isValid = await methods.trigger(fieldsToValidate);

    if (isValid && currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }

  function handlePreviousStep() {
    const currentIndex = steps.indexOf(step);

    if (currentIndex > 0) {
      return setStep(steps[currentIndex - 1]);
    }

    return navigate("/foods");
  }

  async function handleAddFood(food: CreateFoodSchema) {
    try {
      const { id: foodId } = await addFood(food);

      toast.success("Comida adicionada com sucesso", {
        action: {
          label: "Visualizar",
          onClick: () => {
            navigate(`/foods/${foodId}`);
          },
        },
      });

      navigate("/foods");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar comida", {
        description: "Tente novamente mais tarde.",
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleAddFood)}
        className="max-w-2xl mx-auto min-h-screen p-6"
      >
        <div className="flex items-center justify-start gap-2 mb-4">
          <Button
            type="button"
            className="hover:bg-transparent"
            onClick={handlePreviousStep}
            variant="ghost"
          >
            <ChevronLeftIcon className="translate-y-[1px]" />
          </Button>
          <h1 className="text-2xl font-bold">Adicionar Comida</h1>
        </div>
        <ProgressIndicator
          currentStep={steps.indexOf(step) + 1}
          totalSteps={steps.length}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {step === "basicInfo" && <FoodBasicInformationStep />}
            {step === "portions" && <FoodPortionStep />}
            {step === "nutritionalInfo" && <FoodNutritionalInformationStep />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-center">
          {step !== "nutritionalInfo" ? (
            <Button
              type="button"
              className="w-full font-semibold"
              onClick={handleNextStep}
            >
              Avançar
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full"
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Adicionando...
                </>
              ) : (
                "Adicionar comida"
              )}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
