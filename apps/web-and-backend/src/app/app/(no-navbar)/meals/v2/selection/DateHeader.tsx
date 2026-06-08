"use client";

import { twMerge } from "tailwind-merge";

import { useDaySelector } from "@/app/_features/meal/redesign/DaySelector";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";
import AppSubsectionTitle from "@/app/_ui/typography/AppSubsectionTitle";

function DateHeader({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const { daysCount, getFormattedRangeString } = useDaySelector();

  const daysRangeString = getFormattedRangeString();

  return (
    <header className={twMerge("", className)} {...rest}>
      <AppSubsectionTitle className="pb-1.5">
        {daysCount} días seleccionados
      </AppSubsectionTitle>

      <AppSectionTitle className="pb-0">{daysRangeString}</AppSectionTitle>
    </header>
  );
}

export default DateHeader;
