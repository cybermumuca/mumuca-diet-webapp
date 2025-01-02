import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  addDays,
  format,
  isToday,
  isTomorrow,
  isYesterday,
  subDays,
} from "date-fns";
import { useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/get-profile";
import { DiaryHeaderSkeleton } from "./diary-header-skeleton";
import { getGreetingMessage } from "@/utils/get-greeting-message";

type DiaryHeaderProps = {
  date: Date;
  onDateChange: (date: Date) => void;
};

export function DiaryHeader({ date, onDateChange }: DiaryHeaderProps) {
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const [open, setOpen] = useState(false);

  function handlePreviousDay() {
    onDateChange(subDays(date, 1));
  }

  function handleNextDay() {
    onDateChange(addDays(date, 1));
  }

  if (isProfileLoading) {
    return <DiaryHeaderSkeleton />;
  }

  if (!profile) {
    throw error;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {getGreetingMessage(new Date(), profile.firstName)}
      </h1>

      <div className="mb-6 w-full">
        <div className="flex justify-between w-full gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousDay}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left w-full font-semibold",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? (
                  isToday(date) ? (
                    `${format(date, "dd/MM/yyyy")} (Hoje)`
                  ) : isYesterday(date) ? (
                    `${format(date, "dd/MM/yyyy")} (Ontem)`
                  ) : isTomorrow(date) ? (
                    `${format(date, "dd/MM/yyyy")} (Amanhã)`
                  ) : (
                    format(date, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Escolha uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  onDateChange(newDate || new Date());
                  setOpen(false);
                }}
                initialFocus
                fixedWeeks
                locale={ptBR}
                showOutsideDays={false}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
