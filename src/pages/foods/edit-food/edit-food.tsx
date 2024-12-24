import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";

import { queryClient } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/progress-indicator";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";
import { getFood } from "@/api/get-food";
import { FoodNotFoundError } from "../errors/food-not-found-error";
import { updateFood } from "@/api/update-food";
import { FoodBasicInformationStep } from "../add-food/food-basic-information-step";
import { FoodPortionStep } from "../add-food/food-portion-step";
import { FoodNutritionalInformationStep } from "../add-food/food-nutritional-information-step";
import { Food } from "@/types/food";

type Step = "basicInfo" | "portions" | "nutritionalInfo";

const steps: Step[] = ["basicInfo", "portions", "nutritionalInfo"];

const editFoodSchema = z.object({
  title: z.string().nonempty("Nome é obrigatório"),
  brand: z.string().optional(),
  description: z.string().optional(),
  portion: z.object({
    amount: z
      .number({ coerce: true, message: "Deve ser um inteiro positivo" })
      .positive("A quantidade deve ser maior que zero")
      .default(0),
    unit: z.enum(
      [
        "GRAM",
        "MILLIGRAM",
        "KILOGRAM",
        "MICROGRAM",
        "MILLILITER",
        "LITER",
        "CALORIE",
        "KILOJOULE",
        "INTERNATIONAL_UNIT",
        "OUNCE",
        "CUP",
        "TABLESPOON",
        "TEASPOON",
        "SLICE",
        "PIECE",
        "BOWL",
      ],
      { message: "Unidade inválida" }
    ),
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

export type EditFoodSchema = z.infer<typeof editFoodSchema>;

export function EditFood() {
  const navigate = useNavigate();
  const { foodId } = useParams<{ foodId: string }>();
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/foods";
  const [step, setStep] = useState<Step>("basicInfo");

  if (!foodId) {
    throw new FoodNotFoundError();
  }

  const {
    data: food,
    isFetching: isFetchingFood,
    error,
  } = useQuery({
    queryKey: ["food", foodId],
    queryFn: () => getFood({ foodId }),
  });

  const methods = useForm<EditFoodSchema>({
    resolver: zodResolver(editFoodSchema),
    defaultValues: food
      ? {
          title: food.title,
          brand: food.brand ?? undefined,
          description: food.description ?? undefined,
          portion: {
            amount: food.portion.amount,
            unit: food.portion.unit,
            description: food.portion.description ?? undefined,
          },
          nutritionalInformation: {
            ...food.nutritionalInformation,
          },
        }
      : {},
  });

  useEffect(() => {
    if (food) {
      methods.reset({
        ...food,
        brand: food.brand ?? undefined,
        description: food.description ?? undefined,
        portion: {
          ...food.portion,
          description: food.portion.description ?? undefined,
        },
        nutritionalInformation: {
          ...food.nutritionalInformation,
        },
      });
    }
  }, [food, methods]);

  const watchedTitle = useWatch({
    control: methods.control,
    name: "title",
  });

  const watchedPortionAmount = useWatch({
    control: methods.control,
    name: "portion.amount",
  });

  const watchedPortionUnit = useWatch({
    control: methods.control,
    name: "portion.unit",
  });

  useEffect(() => {
    methods.clearErrors("title");
  }, [watchedTitle, methods]);

  useEffect(() => {
    methods.clearErrors("portion.amount");
  }, [watchedPortionAmount, methods]);

  useEffect(() => {
    methods.clearErrors("portion.unit");
  }, [watchedPortionUnit, methods]);

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

  const { mutateAsync: editFood, isPending: isEditingFood } = useMutation({
    mutationFn: (food: EditFoodSchema) => {
      return updateFood(foodId, food);
    },
    onSuccess: (updatedFood) => {
      queryClient.setQueryData(["food", foodId], (oldFood: Food) => {
        return {
          ...oldFood,
          ...updatedFood,
          portion: {
            ...oldFood.portion,
            ...updatedFood.portion,
          },
          nutritionalInformation: {
            ...oldFood.nutritionalInformation,
            ...updatedFood.nutritionalInformation,
          },
        };
      });
      queryClient.refetchQueries({ queryKey: ["foods"], active: true });
    },
  });

  async function handleNextStep() {
    const currentIndex = steps.indexOf(step);

    const fieldsToValidate =
      step === "basicInfo"
        ? (["title", "brand", "description"] as const)
        : step === "portions"
        ? (["portion.amount", "portion.unit", "portion.description"] as const)
        : step === "nutritionalInfo"
        ? (
            Object.keys(
              editFoodSchema.shape.nutritionalInformation.shape
            ) as Array<
              keyof typeof editFoodSchema.shape.nutritionalInformation.shape
            >
          ).map((key) => `nutritionalInformation.${key}` as const)
        : [];

    const isValid = await methods.trigger(fieldsToValidate);

    if (!isValid) {
      return;
    }

    if (step === "nutritionalInfo") {
      const foodValues = methods.getValues();
      handleEditFood(foodValues);
      return;
    }

    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }

  function handlePreviousStep() {
    const currentIndex = steps.indexOf(step);

    if (currentIndex > 0) {
      return setStep(steps[currentIndex - 1]);
    }

    return navigate(backUrl);
  }

  async function handleEditFood(food: EditFoodSchema) {
    try {
      await editFood({ ...food });

      toast.success("Comida editada com sucesso", {
        action: {
          label: "Visualizar",
          onClick: () => {
            navigate(`/foods/${foodId}`);
          },
        },
      });

      navigate(backUrl);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao editar comida", {
        description: "Tente novamente mais tarde.",
      });
    }
  }

  if (isFetchingFood) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (error || !food) {
    if (error && !isAxiosError(error)) {
      throw error;
    }

    throw new FoodNotFoundError();
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleEditFood)}
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
          <h1 className="text-2xl font-bold">Editar Comida</h1>
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
          <Button
            type="button"
            className="w-full font-semibold"
            onClick={handleNextStep}
            disabled={isEditingFood}
          >
            {isEditingFood ? (
              <>
                <Loader2 className="animate-spin" /> Editando...
              </>
            ) : step === "nutritionalInfo" ? (
              "Editar comida"
            ) : (
              "Avançar"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
