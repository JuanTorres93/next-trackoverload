'use client';

import Input from '@/app/_ui/Input';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';

import { updateUserWeightForDay } from '../day/actions';
import { useDebounce } from '@/app/_hooks/useDebounce';

function WeightTracker({ days }: { days: DayEntry[] }) {
  const lastDay = days[days.length - 1];

  return (
    <div>
      <WeightInput lastDay={lastDay} />
      <WeightHistory />
    </div>
  );
}

function WeightInput({ lastDay }: { lastDay: DayEntry }) {
  const debouncedHandleWeightChange = useDebounce(handleWeightChange, 250);

  function handleWeightChange(newWeight: string) {
    updateUserWeightForDay(lastDay.date, Number(newWeight));
  }

  return (
    <Input
      containerClassName="border-0 bg-background gap-2 items-end"
      className="text-3xl text-right"
      placeholder="Tu peso hoy"
      defaultValue={lastDay.day?.userWeightInKg}
      onChange={(e) => debouncedHandleWeightChange(e.target.value)}
      disabled={false}
    >
      <span className="mb-1 text-sm text-text-minor-emphasis ">kg</span>
    </Input>
  );
}

function WeightHistory() {
  return <div>History</div>;
}

export default WeightTracker;
