export function getBMIClassificationLabel(bmi: number) {
  if (bmi < 18.5) {
    return "Abaixo do peso";
  } else if (bmi < 24.9) {
    return "Peso normal";
  } else if (bmi < 29.9) {
    return "Sobrepeso";
  } else if (bmi < 34.9) {
    return "Obesidade I";
  } else if (bmi < 39.9) {
    return "Obesidade II";
  } else {
    return "Obesidade III";
  }
}
