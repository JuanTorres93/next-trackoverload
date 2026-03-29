'use client';

import { useDebounce } from '@/app/_hooks/useDebounce';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { setCaloriesGoalForDay } from '../day/actions';
import Input from '@/app/_ui/Input';
import InputLabel from './InputLabel';
import { HiFire } from 'react-icons/hi2';
import InputContainer from './InputContainer';

function CaloriesGoalInput({
  lastDay,
  defaultCaloriesGoal,
}: {
  lastDay: DayEntry;
  defaultCaloriesGoal?: number;
}) {
  const debouncedHandleCaloriesGoalChange = useDebounce(
    handleCaloriesGoalChange,
    250,
  );

  function handleCaloriesGoalChange(newCaloriesGoal: string) {
    setCaloriesGoalForDay(lastDay.date, Number(newCaloriesGoal));
  }

  return (
    <InputContainer>
      <InputLabel htmlFor="input-calories-goal" icon={<HiFire />}>
        <span>Calorías objetivo</span>
      </InputLabel>

      <Input
        id="input-calories-goal"
        data-testid="input-calories-goal"
        containerClassName="border-0 bg-background gap-2 max-w-34 max-bp-navbar-mobile:min-w-18 items-end p-0"
        className="text-3xl max-bp-navbar-mobile:text-2xl text-text/80 text-right rounded-sm placeholder:text-text-minor-emphasis/65!"
        placeholder="kcal"
        defaultValue={lastDay.day?.updatedCaloriesGoal ?? defaultCaloriesGoal}
        onChange={(e) => debouncedHandleCaloriesGoalChange(e.target.value)}
        disabled={false}
      >
        <span className="mb-1 text-sm text-text-minor-emphasis">kcal</span>
      </Input>
    </InputContainer>
  );
}

export default CaloriesGoalInput;
