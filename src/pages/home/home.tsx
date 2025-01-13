import { useState } from "react";

import { DiaryHeader } from "./components/diary-header";
import { DailyProgress } from "./components/daily-progress";
import { DailyMealLog } from "./components/daily-meal-log";
import { Helmet } from "react-helmet-async";

export function Home() {
  const [date, setDate] = useState(new Date());

  function handleDateChange(newDate: Date) {
    setDate(newDate);
  }

  return (
    <>
      <Helmet title="Diário" />
      <div className="container mx-auto p-4 max-w-4xl">
        <DiaryHeader date={date} onDateChange={handleDateChange} />
        <DailyProgress date={date} />
        <DailyMealLog date={date} />
      </div>
    </>
  );
}
