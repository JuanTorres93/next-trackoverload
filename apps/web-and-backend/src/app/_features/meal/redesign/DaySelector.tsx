"use client";

import { createContext, useContext, useState } from "react";

import { DateRange, DayPicker, getDefaultClassNames } from "@daypicker/react";
import "@daypicker/react/style.css";
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

const DaySelectorContext = createContext<{
  selected: DateRange | undefined;
  setSelected: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  daysCount: number;
  getFormattedRangeString: () => string;
}>({
  selected: undefined,
  setSelected: () => {},
  daysCount: 0,
  getFormattedRangeString: () => "",
});

export function DaySelectorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<DateRange>();

  const daysCount =
    selected?.from && selected?.to
      ? Math.round(
          (selected.to.getTime() - selected.from.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : 0;

  function getFormattedRangeString() {
    if (!selected) return "";

    const from = selected.from;
    const to = selected.to;

    if (!from || !to) return "";

    const daysRangeString = formatDateRange(from, to);
    return daysRangeString;
  }

  return (
    <DaySelectorContext.Provider
      value={{ selected, setSelected, daysCount, getFormattedRangeString }}
    >
      {children}
    </DaySelectorContext.Provider>
  );
}

export function useDaySelector() {
  const context = useContext(DaySelectorContext);
  if (context === undefined) {
    throw new Error("useDaySelector must be used within a DaySelectorProvider");
  }

  return context;
}
export default DaySelector;
