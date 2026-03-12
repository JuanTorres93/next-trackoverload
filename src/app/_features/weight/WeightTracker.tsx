'use client';

import { twMerge } from 'tailwind-merge';

import Input from '@/app/_ui/Input';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';

import { useDebounce } from '@/app/_hooks/useDebounce';
import { updateUserWeightForDay } from '../day/actions';
import WeightHistory from './WeightHistory';

function WeightTracker({
  days,
  ...props
}: { days: DayEntry[] } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const lastDay = days[days.length - 1];

  return (
    <div
      className={twMerge(
        'grid grid-cols-[minmax(17rem,40rem)] gap-4',
        className,
      )}
      {...rest}
    >
      <WeightInput lastDay={lastDay} />
      <WeightHistory days={days} />
    </div>
  );
}

function WeightInput({ lastDay }: { lastDay: DayEntry }) {
  const debouncedHandleWeightChange = useDebounce(handleWeightChange, 250);

  function handleWeightChange(newWeight: string) {
    updateUserWeightForDay(lastDay.date, Number(newWeight));
  }

  return (
    <div className="grid gap-1 grid-cols-[max-content_min-content] items-center text-3xl ">
      <label htmlFor="input-weight">Tu peso hoy:</label>
      <Input
        id="input-weight"
        containerClassName="border-0 bg-background gap-2 min-w-22 items-end p-0"
        className="text-3xl text-right rounded-sm text-primary placeholder:bg-info/20 placeholder:text-text-minor-emphasis/65"
        placeholder="KG"
        defaultValue={lastDay.day?.userWeightInKg}
        onChange={(e) => debouncedHandleWeightChange(e.target.value)}
        disabled={false}
      >
        <span className="mb-1 text-sm text-text-minor-emphasis ">kg</span>
      </Input>
    </div>
  );
}

export default WeightTracker;
