import { getDiagnosis } from "@/api/get-diagnosis";
import { useQuery } from "@tanstack/react-query";
import { BodyDiagnosisSkeleton } from "./body-diagnosis-skeleton";
import { InfoPopover } from "@/components/info-popover";

export function BodyDiagnosis() {
  const { data: userDiagnosis, isLoading: isLoadingDiagnosis } = useQuery({
    queryKey: ["diagnosis"],
    queryFn: getDiagnosis,
  });

  if (isLoadingDiagnosis) {
    return <BodyDiagnosisSkeleton />;
  }

  const diagnosis = userDiagnosis!;

  return (
    <section id="diagnosis" className="mt-4">
      <div className="flex items-center justify-between mt-4 mb-2">
        <h2 className="font-semibold text-lg">Diagnóstico</h2>
        <InfoPopover
          content={
            <div className="space-y-2">
              <p>
                O IMC (Índice de Massa Corporal) é uma medida que relaciona peso
                e altura:
              </p>
              <ul className="list-disc pl-4">
                <li>Abaixo de 18.5: Abaixo do peso</li>
                <li>18.5 a 24.9: Peso normal</li>
                <li>25 a 29.9: Sobrepeso</li>
                <li>30 a 34.9: Obesidade grau 1</li>
                <li>35 ou mais: Obesidade grau 2</li>
              </ul>
            </div>
          }
        />
      </div>
      <div className="flex justify-between lg:justify-around border-[1px] rounded-lg p-4 w-full">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm">IMC</h3>
          <span
            className={`text-lg font-medium ${
              diagnosis.bmi.value < 18.5
                ? "text-yellow-600 dark:text-yellow-400"
                : diagnosis.bmi.value < 25
                ? "text-green-600 dark:text-green-400"
                : diagnosis.bmi.value < 30
                ? "text-yellow-600 dark:text-yellow-400"
                : diagnosis.bmi.value < 35
                ? "text-orange-600 dark:text-orange-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {diagnosis.bmi.value.toPrecision(3)}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-sm">Gordura</h3>
          <span className="text-lg font-medium">{diagnosis.fatRate}</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-sm">Peso Ideal</h3>
          <span className="text-normal font-medium text-green-600 dark:text-green-400">
            {diagnosis.idealMinimumWeight.toPrecision(2)} -{" "}
            {diagnosis.idealMaximumWeight.toPrecision(2)} kg
          </span>
        </div>
      </div>
    </section>
  );
}
