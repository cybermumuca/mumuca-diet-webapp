import { getGoal, GetGoalResponse } from "@/api/get-goal";
import { listBodies } from "@/api/list-bodies";
import { Body } from "@/types/body";
import { useQuery } from "@tanstack/react-query";
import { BodyGoalSkeleton } from "./body-goal-skeleton";

export function BodyGoal() {
  const { data: bodies, isLoading: isLoadingBodies } = useQuery({
    queryKey: ["latestBody"],
    queryFn: () => listBodies({ sort: "desc", size: 1, page: 0 }),
  });

  const { data: goal, isLoading: isLoadingGoal } = useQuery({
    queryKey: ["goal"],
    queryFn: () => getGoal(),
  });

  const latestBody = bodies?.content[0] as Body;
  const userGoal = goal as GetGoalResponse;

  if (isLoadingBodies || isLoadingGoal) {
    return <BodyGoalSkeleton />;
  }

  return (
    <section id="goal" className="mt-4">
      <h2 className="font-semibold text-lg mb-2">Meta</h2>
      <div className="flex justify-between lg:justify-around border-[1px] rounded-lg p-4 w-full">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm">Peso Atual</h3>
          <span className="text-lg font-medium">{latestBody.weight} kg</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm">Meta</h3>
          <span className="text-lg font-medium">
            {userGoal.targetWeight} kg
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-sm">Diferença</h3>
          <span className="text-lg font-medium">
            {(latestBody.weight - userGoal.targetWeight).toPrecision(3)} kg
          </span>
        </div>
      </div>
    </section>
  );
}
