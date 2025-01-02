import { ActivityLevel } from "@/types/activity-level";

export function getActivityLevelLabel(activityLevel: ActivityLevel) {
  switch (activityLevel) {
    case "SEDENTARY":
      return "Sedentário";
    case "LIGHTLY_ACTIVE":
      return "Levemente ativo";
    case "MODERATELY_ACTIVE":
      return "Moderadamente ativo";
    case "VERY_ACTIVE":
      return "Muito ativo";
    case "EXTRA_ACTIVE":
      return "Extremamente ativo";
    default:
      return "Nível de atividade desconhecido";
  }
}
