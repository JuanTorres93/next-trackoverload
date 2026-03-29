'use client';

import { useDebounce } from '@/app/_hooks/useDebounce';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { updateUserWeightForDay } from '../day/actions';
import Input from '@/app/_ui/Input';
import { twMerge } from 'tailwind-merge';
import InputLabel from './InputLabel';
import { HiScale } from 'react-icons/hi2';
import InputContainer from './InputContainer';

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
    <InputContainer>
      <InputLabel htmlFor="input-weight" icon={<HiScale />}>
        <span>Peso hoy</span>
      </InputLabel>

      <Input
        id="input-weight"
        data-testid="input-weight"
        containerClassName="border-0 bg-background gap-2 min-w-22 max-bp-navbar-mobile:min-w-18 items-end p-0"
        className={twMerge(
          `text-3xl max-bp-navbar-mobile:text-2xl text-text/80 text-right rounded-sm placeholder:text-text-minor-emphasis/65!`,
          placeholderBackground,
        )}
        placeholder="KG"
        defaultValue={lastDay.day?.userWeightInKg}
        onChange={(e) => debouncedHandleWeightChange(e.target.value)}
        disabled={false}
      >
        <span className="mb-1 text-sm text-text-minor-emphasis ">kg</span>
      </Input>
    </InputContainer>
  );
}

export default WeightInput;
