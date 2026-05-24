"use client";

import { HiFire } from "react-icons/hi2";

import { showErrorToast } from "@/app/_ui/showErrorToast";

import { DayEntry } from "../../../application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase";
import { useDebounce } from "../../_hooks/useDebounce";
import Input from "../../_ui/Input";
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

  async function handleCaloriesGoalChange(newCaloriesGoal: string) {
    const jsend = await setCaloriesGoalForDay(
      lastDay.date,
      Number(newCaloriesGoal),
    );

    if (jsend.status !== "success") {
      showErrorToast(
        jsend.data?.message ||
          "Error al actualizar el objetivo de calorías. Por favor, intenta de nuevo.",
      );
    }
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
