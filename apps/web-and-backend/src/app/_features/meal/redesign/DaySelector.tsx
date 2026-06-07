"use client";

import { useEffect, useState } from "react";

import { DateRange, DayPicker, getDefaultClassNames } from "@daypicker/react";
import "@daypicker/react/style.css";
import { twMerge } from "tailwind-merge";

function DaySelector({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const defaultClassNames = getDefaultClassNames();

  const [selected, setSelected] = useState<DateRange>();

  useEffect(() => {
    console.log("Selected range:", selected);
  }, [selected]);

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

export default DaySelector;
