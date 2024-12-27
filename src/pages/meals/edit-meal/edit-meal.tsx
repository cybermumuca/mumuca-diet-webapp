import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { z } from "zod";
import { MealNotFoundError } from "../errors/meal-not-found-error";
import { getMeal } from "@/api/get-meal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";
import { updateMeal } from "@/api/update-meal";
import { queryClient } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { ProgressIndicator } from "@/components/progress-indicator";
import { AnimatePresence, motion } from "motion/react";
import { MealBasicInformationStep } from "../add-meal/meal-basic-information-step";
import { MealAddFoodsStep } from "../add-meal/meal-add-foods-step";
import { removeFoodsFromMeal } from "@/api/remove-foods-from-meal";
import { addFoodsToMeal } from "@/api/add-foods-to-meal";

type Step = "basicInfo" | "addFood";

const steps: Step[] = ["basicInfo", "addFood"];

const editMealSchema = z.object({
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

export type EditMealSchema = z.infer<typeof editMealSchema>;

export function EditMeal() {
  const navigate = useNavigate();
  const { mealId } = useParams<{ mealId: string }>();
  const location = useLocation();
  const backUrl: string = location.state?.backUrl ?? "/meals";
  const [step, setStep] = useState<Step>("basicInfo");

  if (!mealId) {
    throw new MealNotFoundError();
  }

  const {
    data: meal,
    isFetching: isFetchingMeal,
    error,
  } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => getMeal({ mealId }),
    retry: false,
  });

  const methods = useForm<EditMealSchema>({
    resolver: zodResolver(editMealSchema),
    defaultValues: meal
      ? {
          title: meal.title,
          description: meal.description ?? undefined,
          mealType: meal.type,
          foodIds: meal.foods.map((food) => food.id),
        }
      : {},
  });

  useEffect(() => {
    if (meal) {
      methods.reset(
        {
          description: meal.description ?? undefined,
          title: meal.title,
          mealType: meal.type,
          foodIds: meal.foods.map((food) => food.id),
        },
        { keepDefaultValues: false }
      );
    }
  }, [meal, methods]);

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
    methods.setValue("mealType", watchedMealType);
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

  const { mutateAsync: editMeal, isPending: isEditingMeal } = useMutation({
    mutationFn: async (updatedMeal: EditMealSchema) => {
      const oldFoodIds = meal?.foods?.map((item) => item.id) ?? [];
      const newFoodIds = updatedMeal.foodIds ?? [];

      const foodsToRemove = oldFoodIds.filter((id) => !newFoodIds.includes(id));
      const foodsToAdd = newFoodIds.filter((id) => !oldFoodIds.includes(id));

      await updateMeal(mealId, updatedMeal);

      if (foodsToRemove.length > 0) {
        await removeFoodsFromMeal(mealId, { foodIds: foodsToRemove });
      }

      if (foodsToAdd.length > 0) {
        await addFoodsToMeal(mealId, { foodIds: foodsToAdd });
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["meal"], active: true });
      queryClient.refetchQueries({ queryKey: ["meals"], active: true });
      queryClient.refetchQueries({ queryKey: ["foodMeals"], active: true });
      queryClient.refetchQueries({
        queryKey: ["mealNutritionalInformation"],
        active: true,
      });
    },
  });

  async function handleEditMeal(meal: EditMealSchema) {
    try {
      await editMeal(meal);
      navigate(backUrl);
    } catch (error) {
      console.error(error);
    }
  }

  function handlePreviousStep() {
    const currentIndex = steps.indexOf(step);

    if (currentIndex > 0) {
      return setStep(steps[currentIndex - 1]);
    }

    return navigate(backUrl);
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

    if (!isValid) {
      return;
    }

    if (step === "addFood") {
      const foodValues = methods.getValues();
      handleEditMeal(foodValues);
      return;
    }

    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }

  if (isFetchingMeal) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (error || !meal) {
    if (error && !isAxiosError(error)) {
      throw error;
    }

    throw new MealNotFoundError();
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleEditMeal)}
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
          <h1 className="text-2xl font-bold">Editar Refeição</h1>
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
          <Button
            type="button"
            className="w-full font-semibold"
            onClick={handleNextStep}
            disabled={isEditingMeal}
          >
            {isEditingMeal ? (
              <>
                <Loader2 className="animate-spin" /> Editando...
              </>
            ) : step === "addFood" ? (
              "Editar refeição"
            ) : (
              "Avançar"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
