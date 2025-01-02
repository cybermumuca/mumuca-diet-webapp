import { useState } from "react";

import { DiaryHeader } from "./components/diary-header";
import { DailyProgress } from "./components/daily-progress";

export function Home() {
  const [date, setDate] = useState(new Date());

  function handleDateChange(newDate: Date) {}

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <DiaryHeader date={date} onDateChange={handleDateChange} />
      <DailyProgress date={date} />
    </div>
  );
}
