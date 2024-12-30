import { ActivityLevel } from "@/types/activity-level";
import { Gender } from "@/types/gender";
import { GoalType } from "@/types/goal-type";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { InfoPopover } from "@/components/info-popover";

type ConfirmGoalStepProps = {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  goalType: GoalType;
  activityLevel: ActivityLevel;
  targetWeight: number;
  targetCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterIntakeTarget: number;
  deadline: Date;
};

export function ConfirmGoalStep({
  weight,
  height,
  age,
  gender,
  goalType,
  activityLevel,
  targetWeight,
  targetCalories,
  proteinTarget,
  carbsTarget,
  fatTarget,
  waterIntakeTarget,
  deadline,
}: ConfirmGoalStepProps) {
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const renderConfirmationItem = (
    label: string,

    value: string | number,
    measure?: string,
    info?: string
  ) => (
    <div className="flex justify-between items-center py-2 border-b">
      <p>
        {label} <span>{info && <InfoPopover content={info} />}</span>
      </p>

      <p className="font-semibold">
        {value}
        <span className="text-muted-foreground"> {measure}</span>
      </p>
    </div>
  );

  return (
    <div className="space-y-4 py-2 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Confirme seu plano{" "}
        <span>
          {
            <InfoPopover content="É possível alterar tudo mais tarde, mas é importante que as informações providas estejam corretas para que possamos calcular corretamente suas necessidades nutricionais. Caso tenha fornecido informações incorretas, por favor, use o botão de Resetar." />
          }
        </span>
      </h2>
      <div className="space-y-2">
        {renderConfirmationItem("Peso atual", weight, "kg")}
        {renderConfirmationItem("Altura", height, "m")}
        {renderConfirmationItem("Idade", age, "anos")}
        {renderConfirmationItem(
          "Gênero",
          gender === "MALE" ? "Masculino" : "Feminino"
        )}
        {renderConfirmationItem(
          "Objetivo",
          goalType === "LOSE_WEIGHT"
            ? "Perder peso"
            : goalType === "GAIN_WEIGHT"
            ? "Ganhar peso"
            : "Manter peso"
        )}
        {renderConfirmationItem(
          "Nível de atividade",
          activityLevel === "SEDENTARY"
            ? "Sedentário"
            : activityLevel === "LIGHTLY_ACTIVE"
            ? "Levemente ativo"
            : activityLevel === "MODERATELY_ACTIVE"
            ? "Moderadamente ativo"
            : activityLevel === "VERY_ACTIVE"
            ? "Muito ativo"
            : "Extremamente ativo"
        )}
        {renderConfirmationItem("Peso alvo", targetWeight, "kg")}
        {renderConfirmationItem(
          "Calorias",
          targetCalories,
          "kcal",
          `Meta diária de calorias calculada com base no seu peso, altura, idade, gênero e nível de atividade física. Depois ajustado para seu objetivo de ${
            goalType === "LOSE_WEIGHT"
              ? "perder peso."
              : goalType === "GAIN_WEIGHT"
              ? "ganhar peso."
              : "manter o peso."
          }`
        )}
        {renderConfirmationItem(
          "Proteínas",
          proteinTarget,
          "g",
          "Meta diária de proteínas calculada usando 25% do total de calorias diárias como referência."
        )}
        {renderConfirmationItem(
          "Carboidratos",
          carbsTarget,
          "g",
          "Meta diária de carboidratos calculada usando 45% do total de calorias diárias como referência."
        )}
        {renderConfirmationItem(
          "Gorduras",
          fatTarget,
          "g",
          "Meta diária de lipídios(gorduras) calculada usando 30% do total de calorias diárias como referência."
        )}
        {renderConfirmationItem(
          "Consumo de água",
          waterIntakeTarget,
          "L",
          "Consumo diário de água calculado usando a recomendação de 35ml de água por kg de peso corporal para garantir hidratação adequada e suportar funções vitais do organismo."
        )}
        {renderConfirmationItem(
          "Conclusão",
          formatDate(deadline),
          "",
          `${
            goalType === "LOSE_WEIGHT"
              ? "Meta estabelecida considerando uma perda saudável de 0,75kg por semana."
              : goalType === "GAIN_WEIGHT"
              ? "Meta estabelecida considerando um ganho saudável de 0,5kg por semana."
              : "Meta recomendada para manutenção do peso."
          }`
        )}
      </div>
    </div>
  );
}
