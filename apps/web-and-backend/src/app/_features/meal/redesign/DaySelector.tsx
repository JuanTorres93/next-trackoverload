"use client";

import { createContext, useContext, useState } from "react";

import { DateRange, DayPicker, getDefaultClassNames } from "@daypicker/react";
import "@daypicker/react/style.css";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import { formatDateRange } from "@/app/_utils/format/formatDateRange";

function DaySelector({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const defaultClassNames = getDefaultClassNames();

  const { selected, setSelected } = useDaySelector();

  return (
    <div className={twMerge("", className)} {...rest}>
      <DayPicker
        animate
        mode="range"
        ISOWeek
        classNames={{
          today: `bg-secondary-app text-white rounded-full`,
          selected: `bg-primary-light-app rounded-full`,
          range_start: `bg-primary-light-app rounded-none rounded-l-full`,
          range_end: `bg-primary-light-app rounded-none rounded-r-full`,
          range_middle: `bg-primary-light-app rounded-none`,

          caption_label: `${defaultClassNames.caption_label} font-semibold text-[18px]`,
          weekday: `${defaultClassNames.weekday} text-text-minor-emphasis-app font-semibold text-[14px]`,

          chevron: `${defaultClassNames.chevron} fill-secondary-app!`,

          root: `${defaultClassNames.root} bg-white w-fit p-[15px] rounded-[20px] overflow-hidden`,
        }}
        selected={selected}
        onSelect={setSelected}
        // footer={
        // selected
        // ? `Selected: ${selected.toLocaleDateString()}`
        // : "Pick a day."
        // }
      />
    </div>
  );
}

export function SelectedDays({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const { selected } = useDaySelector();

  if (!selected) return null;

  const from = selected.from;
  const to = selected.to;

  if (!from || !to) return null;

  const daysRangeString = formatDateRange(from, to);
  const daysCount =
    Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div
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
        <span className="font-semibold text-[16px]">{daysRangeString}</span>
      </div>

      <span className="font-medium text-[12px]">{daysCount} días</span>
    </div>
  );
}

const DaySelectorContext = createContext<{
  selected: DateRange | undefined;
  setSelected: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}>({
  selected: undefined,
  setSelected: () => {},
});

export function DaySelectorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<DateRange>();

  return (
    <DaySelectorContext.Provider value={{ selected, setSelected }}>
      {children}
    </DaySelectorContext.Provider>
  );
}

function useDaySelector() {
  const context = useContext(DaySelectorContext);
  if (context === undefined) {
    throw new Error("useDaySelector must be used within a DaySelectorProvider");
  }

  return context;
}
export default DaySelector;
