'use client';

import { useDebounce } from '@/app/_hooks/useDebounce';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { setCaloriesGoalForDay } from '../day/actions';
import Input from '@/app/_ui/Input';

function CaloriesGoalInput({ lastDay }: { lastDay: DayEntry }) {
  const debouncedHandleCaloriesGoalChange = useDebounce(
    handleCaloriesGoalChange,
    250,
  );

  function handleCaloriesGoalChange(newCaloriesGoal: string) {
    setCaloriesGoalForDay(lastDay.date, Number(newCaloriesGoal));
  }

  return (
    <div className="grid gap-2 grid-cols-[max-content_min-content] items-center text-3xl">
      <label htmlFor="input-calories-goal">Calorías objetivo:</label>

      <Input
        id="input-calories-goal"
        data-testid="input-calories-goal"
        containerClassName="border-0 bg-background gap-2 min-w-30 items-end p-0"
        className="text-3xl text-right rounded-sm text-primary placeholder:text-text-minor-emphasis/65!"
        placeholder="kcal"
        defaultValue={lastDay.day?.updatedCaloriesGoal}
        onChange={(e) => debouncedHandleCaloriesGoalChange(e.target.value)}
        disabled={false}
      >
        <span className="mb-1 text-sm text-text-minor-emphasis">kcal</span>
      </Input>
    </div>
  );
}

export default CaloriesGoalInput;
