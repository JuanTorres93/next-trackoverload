import { DayEntry } from "shared";
import { twMerge } from "tailwind-merge";

import AppHeader from "@/app/_ui/typography/AppHeader";

import WeightHistory from "../weight/WeightHistory";

function WeightProgress({
  daysShortTerm,
  daysMediumTerm,
  daysLongTerm,
  ...props
}: {
  daysShortTerm: DayEntry[];
  daysMediumTerm: DayEntry[];
  daysLongTerm: DayEntry[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex flex-col gap-3", className)} {...rest}>
      <AppHeader>Progreso de peso</AppHeader>

      <div>
        <WeightHistory days={daysShortTerm} />
        <WeightHistory days={daysMediumTerm} />
        <WeightHistory days={daysLongTerm} />
      </div>
    </div>
  );
}

export default WeightProgress;
