"use client";

import { HiOutlineCalendarDays } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import { useDaySelector } from "../../meal/redesign/DaySelector";

function SelectedDays({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const { daysCount, getFormattedRangeString } = useDaySelector();

  const daysRangeString = getFormattedRangeString();

  if (!daysRangeString) return null;

  return (
    <aside
      className={twMerge(
        "grid grid-cols-[max-content_1fr_max-content] items-center gap-2.5 p-2.5 bg-white rounded-xl",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-center p-2.5 bg-background-app rounded-full">
        <HiOutlineCalendarDays size={22} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-text-minor-emphasis-app font-medium text-[12px]">
          Rango seleccionado
        </span>

        <time className="font-semibold text-[16px]">{daysRangeString}</time>
      </div>

      <span className="font-medium text-[12px]">{daysCount} días</span>
    </aside>
  );
}

export default SelectedDays;
