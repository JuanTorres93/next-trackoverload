"use client";

import { HiScale } from "react-icons/hi2";
import { DayEntry } from "shared";

import { showErrorToast } from "@/app/_ui/showErrorToast";

import { useDebounce } from "../../_hooks/useDebounce";
import Input from "../../_ui/Input";
import { updateUserWeightForDay } from "../day/actions";
import InputContainer from "./InputContainer";
import InputLabel from "./InputLabel";

function WeightInput({
  lastDay,
  className,
}: {
  lastDay: DayEntry;
  className?: string;
}) {
  const debouncedHandleWeightChange = useDebounce(handleWeightChange, 250);
  const hasWeight = lastDay.day?.userWeightInKg !== undefined;

  async function handleWeightChange(newWeight: string) {
    const jsend = await updateUserWeightForDay(lastDay.date, Number(newWeight));

    if (jsend.status !== "success") {
      showErrorToast(
        jsend.data?.message ||
          "Error al actualizar el peso. Por favor, intenta de nuevo.",
      );
    }
  }

  return (
    <InputContainer className={className}>
      <InputLabel htmlFor="input-weight" icon={<HiScale />}>
        <span>Peso hoy</span>
      </InputLabel>

      <Input
        id="input-weight"
        type="number"
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
        className={`text-xs text-text-minor-emphasis/70 italic ${hasWeight ? "invisible" : ""}`}
      >
        Sin registrar hoy
      </p>
    </InputContainer>
  );
}

export default WeightInput;
