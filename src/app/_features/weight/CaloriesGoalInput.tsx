"use client";

import { HiFire } from "react-icons/hi2";

import { useDebounce } from "@/app/_hooks/useDebounce";
import Input from "@/app/_ui/Input";
import { DayEntry } from "@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase";

import { setCaloriesGoalForDay } from "../day/actions";
import InputContainer from "./InputContainer";
import InputLabel from "./InputLabel";

function CaloriesGoalInput({
  lastDay,
  defaultCaloriesGoal,
  className,
}: {
  lastDay: DayEntry;
  defaultCaloriesGoal?: number;
  className?: string;
}) {
  const debouncedHandleCaloriesGoalChange = useDebounce(
    handleCaloriesGoalChange,
    250,
  );

  function handleCaloriesGoalChange(newCaloriesGoal: string) {
    setCaloriesGoalForDay(lastDay.date, Number(newCaloriesGoal));
  }

  return (
    <InputContainer className={className}>
      <InputLabel htmlFor="input-calories-goal" icon={<HiFire />}>
        <span>Calorías objetivo</span>
      </InputLabel>

      <Input
        id="input-calories-goal"
        data-testid="input-calories-goal"
        containerClassName="border border-border/30 bg-input-background rounded-lg px-3 py-1.5 items-baseline gap-2 w-full"
        className="text-3xl max-bp-navbar-mobile:text-2xl text-text/80"
        placeholder="kcal"
        defaultValue={lastDay.day?.updatedCaloriesGoal ?? defaultCaloriesGoal}
        onChange={(e) => debouncedHandleCaloriesGoalChange(e.target.value)}
        disabled={false}
      >
        <span className="text-sm font-medium shrink-0 text-text-minor-emphasis">
          kcal
        </span>
      </Input>
    </InputContainer>
  );
}

export default CaloriesGoalInput;
