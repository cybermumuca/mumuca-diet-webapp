import { Card } from "@/components/ui/card";
import { MealType } from "@/types/meal";

export interface MealCardProps {
  id: string;
  title: string;
  type: MealType;
  calories?: number;
  onClick: (id: string) => void;
}

export function MealCard({
  id,
  title,
  type,
  calories,
  onClick,
}: MealCardProps) {
  let translatedType = "";

  switch (type) {
    case "BREAKFAST":
      translatedType = "Café da Manhã";
      break;
    case "BRUNCH":
      translatedType = "Café da Manhã Tardio";
      break;
    case "LUNCH":
      translatedType = "Almoço";
      break;
    case "AFTERNOON_SNACK":
      translatedType = "Lanche da Tarde";
      break;
    case "DINNER":
      translatedType = "Jantar";
      break;
    case "SUPPER":
      translatedType = "Ceia";
      break;
    case "SNACK":
      translatedType = "Lanche";
      break;
    case "PRE_WORKOUT":
      translatedType = "Pré-treino";
      break;
    case "POST_WORKOUT":
      translatedType = "Pós-treino";
      break;
    case "MIDNIGHT_SNACK":
      translatedType = "Lanche da Meia-noite";
      break;
    default:
      translatedType = type;
  }

  return (
    <Card className="p-4 cursor-pointer" onClick={() => onClick(id)}>
      <h3 className="font-medium">{title}</h3>
      {translatedType && (
        <p className="text-sm text-muted-foreground">{translatedType}</p>
      )}
      {calories && (
        <p className="text-sm text-primary font-semibold">{calories} kcal</p>
      )}
    </Card>
  );
}
