import { createMeal } from "@/api/create-meal";
import { ProgressIndicator } from "@/components/progress-indicator";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useLayoutEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { MealBasicInformationStep } from "./meal-basic-information-step";
import { MealAddFoodsStep } from "./meal-add-foods-step";

type Step = "basicInfo" | "addFood";

const steps: Step[] = ["basicInfo", "addFood"];

const createMealSchema = z.object({
  title: z.string().nonempty({ message: "Nome é obrigatório" }),
  description: z.string().optional(),
  mealType: z.enum(
    [
      "BREAKFAST",
      "BRUNCH",
      "LUNCH",
      "AFTERNOON_SNACK",
      "DINNER",
      "SUPPER",
      "SNACK",
      "PRE_WORKOUT",
      "POST_WORKOUT",
      "MIDNIGHT_SNACK",
    ],
    { message: "Selecione um tipo de refeição" }
  ),
  foodIds: z
    .array(z.string().uuid())
    .refine(
      (arr) => arr.every((id) => z.string().uuid().safeParse(id).success),
      {
        message: "Todos os itens devem ser UUIDs válidos",
      }
    ),
});

export type CreateMealSchema = z.infer<typeof createMealSchema>;

export function AddMeal() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("basicInfo");

  const methods = useForm<CreateMealSchema>({
    resolver: zodResolver(createMealSchema),
  });

  const watchedTitle = useWatch({
    control: methods.control,
    name: "title",
  });

  const watchedMealType = useWatch({
    control: methods.control,
    name: "mealType",
  });

  useEffect(() => {
    methods.clearErrors("title");
  }, [watchedTitle, methods]);

  useEffect(() => {
    methods.clearErrors("mealType");
  }, [watchedMealType, methods]);

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 401) {
            navigate("/sign-in", {
              replace: true,
            });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  const { mutateAsync: addMeal } = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["meals"], active: true });
      queryClient.refetchQueries({ queryKey: ["foodMeals"], active: true });
    },
  });

  async function handleAddMeal(meal: CreateMealSchema) {
    try {
      const { id: mealId } = await addMeal({
        title: meal.title,
        description: meal.description,
        type: meal.mealType,
        foodIds: meal.foodIds,
      });

      toast.success("Refeição adicionada com sucesso", {
        action: {
          label: "Visualizar",
          onClick: () => {
            navigate(`/meals/${mealId}`);
          },
        },
      });

      navigate("/meals");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar comida", {
        description: "Tente novamente mais tarde.",
      });
    }
  }

  function handlePreviousStep() {
    const currentIndex = steps.indexOf(step);

    if (currentIndex > 0) {
      return setStep(steps[currentIndex - 1]);
    }

    return navigate("/meals");
  }

  async function handleNextStep() {
    const currentIndex = steps.indexOf(step);

    const fieldsToValidate =
      step === "basicInfo"
        ? (["title", "description", "mealType"] as const)
        : step === "addFood"
        ? (["foodIds"] as const)
        : [];

    const isValid = await methods.trigger(fieldsToValidate);

    if (isValid && currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleAddMeal)}
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
          <h1 className="text-2xl font-bold">Adicionar Refeição</h1>
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
            {step === "basicInfo" && <MealBasicInformationStep />}
            {step === "addFood" && <MealAddFoodsStep />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-center">
          {step !== "addFood" ? (
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
                "Adicionar Refeição"
              )}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
