import { getDailyProgress } from "@/api/get-daily-progress";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DailyProgressSkeleton } from "./daily-progress-skeleton";

type DailyProgressProps = {
  date: Date;
};

export function DailyProgress({ date }: DailyProgressProps) {
  const {
    data: dailyProgress,
    isLoading: isDailyProgressLoading,
    error,
  } = useQuery({
    queryKey: ["dailyProgress", date],
    queryFn: () => {
      const formattedDate = format(date, "dd/MM/yyyy");
      return getDailyProgress({ date: formattedDate });
    },
  });

  if (isDailyProgressLoading) {
    return <DailyProgressSkeleton />;
  }

  if (!dailyProgress) {
    throw error;
  }

  return <div>a</div>;
}
