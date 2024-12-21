import { Unit } from "@/types/food";

export function getUnitLabel(unit: Unit) {
  switch (unit) {
    case "GRAM":
      return "g";
    case "MILLIGRAM":
      return "mg";
    case "KILOGRAM":
      return "kg";
    case "MICROGRAM":
      return "µg";
    case "MILLILITER":
      return "ml";
    case "LITER":
      return "l";
    case "CALORIE":
      return "kcal";
    case "KILOJOULE":
      return "kJ";
    case "INTERNATIONAL_UNIT":
      return "IU";
    case "OUNCE":
      return "oz";
    case "CUP":
      return "xícara";
    case "TABLESPOON":
      return "colher de sopa";
    case "TEASPOON":
      return "colher de chá";
    case "SLICE":
      return "fatias";
    case "PIECE":
      return "peças";
    case "BOWL":
      return "tigelas";
  }
}
