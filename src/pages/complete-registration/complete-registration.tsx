import { ProgressIndicator } from "@/components/progress-indicator";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { RegistrationBasicInformationStep } from "./registration-basic-information-step";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import { RegistrationGoalStep } from "./registration-goal-step";
import { useMutation } from "@tanstack/react-query";
import {
  completeRegistration,
  CompleteRegistrationResponse,
} from "@/api/complete-registration";
import { ConfirmGoalStep } from "./confirm-goal-step";
import { resetRegister } from "@/api/reset-register";

type Step = "basicInfo" | "goal" | "confirmGoal";

const steps: Step[] = ["basicInfo", "goal", "confirmGoal"];

const completeRegistrationSchema = z.object({
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
  gender: z.enum(["MALE", "FEMALE"], { message: "Selecione um gênero." }),
  birthDate: z
    .date({ message: "Selecione a data de nascimento." })
    .max(new Date(), "A Data de nascimento deve estar no passado."),
  activityLevel: z.enum(
    [
      "SEDENTARY",
      "LIGHTLY_ACTIVE",
      "MODERATELY_ACTIVE",
      "VERY_ACTIVE",
      "EXTRA_ACTIVE",
    ],
    { message: "Selecione um nível de atividade." }
  ),
  goal: z.enum(["LOSE_WEIGHT", "MAINTAIN_WEIGHT", "GAIN_WEIGHT"], {
    message: "Selecione um objetivo.",
  }),
  targetWeight: z
    .number({ message: "Peso alvo deve ser um número.", coerce: true })
    .min(0, "O peso alvo não deve ser zero.")
    .positive({ message: "Peso alvo deve ser um número positivo." }),
});

export type CompleteRegistrationSchema = z.infer<
  typeof completeRegistrationSchema
>;

export function CompleteRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("basicInfo");
  const [registrationData, setRegistrationData] =
    useState<CompleteRegistrationResponse>({} as CompleteRegistrationResponse);

  const methods = useForm<CompleteRegistrationSchema>({
    resolver: zodResolver(completeRegistrationSchema),
  });

  useEffect(() => {
    const subscription = methods.watch((_, { name }) => {
      if (name) methods.clearErrors(name);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  function handlePreviousStep() {
    const currentIndex = steps.indexOf(step);

    if (currentIndex > 0) {
      return setStep(steps[currentIndex - 1]);
    }
  }

  const {
    mutateAsync: submitRegistration,
    isPending: isSubmittingRegistration,
  } = useMutation({
    mutationFn: completeRegistration,
  });

  const { mutateAsync: resetRegistration } = useMutation({
    mutationFn: resetRegister,
    retry: 3,
    retryDelay: 1000,
  });

  async function handleSubmitRegistration(data: CompleteRegistrationSchema) {
    try {
      const registrationData = await submitRegistration(data);
      setRegistrationData(registrationData);
      setStep("confirmGoal");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleResetRegister() {
    methods.reset();
    setStep("basicInfo");
    await resetRegistration();
  }

  async function handleNextStep() {
    const currentIndex = steps.indexOf(step);

    const fieldsToValidate =
      step === "basicInfo"
        ? ([
            "weight",
            "height",
            "gender",
            "birthDate",
            "activityLevel",
          ] as const)
        : step === "goal"
        ? (["targetWeight", "goal"] as const)
        : step === "confirmGoal"
        ? (
            Object.keys(completeRegistrationSchema.shape) as Array<
              keyof typeof completeRegistrationSchema.shape
            >
          ).map((key) => `${key}` as const)
        : [];

    const isValid = await methods.trigger(fieldsToValidate);

    if (!isValid) {
      return;
    }

    if (step === "goal") {
      const goalValues = methods.getValues();
      handleSubmitRegistration(goalValues);
      return;
    }

    if (step === "confirmGoal") {
      navigate("/", { replace: true });
      return;
    }

    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmitRegistration)}
        className="container mx-auto px-8 py-6 max-w-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="hover:bg-transparent"
              onClick={handlePreviousStep}
              disabled={step === "basicInfo"}
              variant="ghost"
            >
              <ChevronLeftIcon className="translate-y-[1px]" />
            </Button>
            <h1 className="text-2xl font-bold text-nowrap">
              Completar Registro
            </h1>
          </div>
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
            {step === "basicInfo" && <RegistrationBasicInformationStep />}
            {step === "goal" && <RegistrationGoalStep />}
            {step === "confirmGoal" && (
              <ConfirmGoalStep {...registrationData} />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex flex-col justify-center">
          {step === "confirmGoal" && (
            <Button
              type="button"
              variant="destructive"
              className="w-full mb-4 font-semibold"
              onClick={handleResetRegister}
            >
              Resetar
            </Button>
          )}

          <Button
            type="button"
            className="w-full font-semibold"
            onClick={handleNextStep}
            disabled={isSubmittingRegistration}
          >
            {isSubmittingRegistration ? (
              <>
                <Loader2 className="animate-spin" />
              </>
            ) : (
              "Avançar"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
