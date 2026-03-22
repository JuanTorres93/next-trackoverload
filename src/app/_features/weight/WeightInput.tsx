'use client';

import { useDebounce } from '@/app/_hooks/useDebounce';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { updateUserWeightForDay } from '../day/actions';
import Input from '@/app/_ui/Input';
import { twMerge } from 'tailwind-merge';

function WeightInput({
  lastDay,
  placeholderBackground,
}: {
  lastDay: DayEntry;
  placeholderBackground: string;
}) {
  const debouncedHandleWeightChange = useDebounce(handleWeightChange, 250);

  function handleWeightChange(newWeight: string) {
    updateUserWeightForDay(lastDay.date, Number(newWeight));
  }

  return (
    <div className="grid gap-1 grid-cols-[max-content_min-content] items-center text-3xl max-bp-navbar-mobile:text-2xl">
      <label htmlFor="input-weight">Tu peso hoy:</label>
      <Input
        id="input-weight"
        data-testid="input-weight"
        containerClassName="border-0 bg-background gap-2 min-w-22 max-bp-navbar-mobile:min-w-18 items-end p-0"
        className={twMerge(
          `text-3xl max-bp-navbar-mobile:text-2xl text-right rounded-sm text-primary placeholder:text-text-minor-emphasis/65!`,
          placeholderBackground,
        )}
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

export default WeightInput;
