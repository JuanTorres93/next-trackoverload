"use client";

import { useState } from "react";

import { DayPicker, getDefaultClassNames } from "@daypicker/react";
import "@daypicker/react/style.css";
import { twMerge } from "tailwind-merge";

function DaySelector({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const defaultClassNames = getDefaultClassNames();

  const [selected, setSelected] = useState<Date>();

  return (
    <div className={twMerge("", className)} {...rest}>
      <DayPicker
        animate
        mode="single"
        classNames={{
          selected: `bg-primary-app border-primary-app rounded-full`,
          today: `border-secondary-app bg-secondary-app text-white rounded-full`,
          root: `${defaultClassNames.root} bg-white w-fit p-[15px] rounded-[20px] overflow-hidden`,
          chevron: `${defaultClassNames.chevron} fill-secondary-app!`,
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
