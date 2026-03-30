'use client';

import { useDebounce } from '@/app/_hooks/useDebounce';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { updateUserWeightForDay } from '../day/actions';
import Input from '@/app/_ui/Input';
import InputLabel from './InputLabel';
import { HiScale } from 'react-icons/hi2';
import InputContainer from './InputContainer';

function WeightInput({
  lastDay,
  className,
}: {
  lastDay: DayEntry;
  className?: string;
}) {
  const debouncedHandleWeightChange = useDebounce(handleWeightChange, 250);
  const hasWeight = lastDay.day?.userWeightInKg !== undefined;

  function handleWeightChange(newWeight: string) {
    updateUserWeightForDay(lastDay.date, Number(newWeight));
  }

  return (
    <InputContainer className={className}>
      <InputLabel htmlFor="input-weight" icon={<HiScale />}>
        <span>Peso hoy</span>
      </InputLabel>

      <Input
        id="input-weight"
        data-testid="input-weight"
        containerClassName="border border-border/30 bg-input-background rounded-lg px-3 py-1.5 items-baseline gap-2 w-full"
        className="text-3xl max-bp-navbar-mobile:text-2xl text-text/80"
        placeholder="KG"
        defaultValue={lastDay.day?.userWeightInKg}
        onChange={(e) => debouncedHandleWeightChange(e.target.value)}
        disabled={false}
      >
        <span className="text-sm font-medium shrink-0 text-text-minor-emphasis">
          kg
        </span>
      </Input>

      <p
        className={`text-xs text-text-minor-emphasis/70 italic ${hasWeight ? 'invisible' : ''}`}
      >
        Sin registrar hoy
      </p>
    </InputContainer>
  );
}

export default WeightInput;
