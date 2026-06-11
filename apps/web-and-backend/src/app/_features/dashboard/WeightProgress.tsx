"use client";

import { useState } from "react";

import { DayEntry } from "shared";
import { twMerge } from "tailwind-merge";

import AppHeader from "@/app/_ui/typography/AppHeader";
import { formatWeight } from "@/app/_utils/format/formatWeight";

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

  const [shownTimeframe, setShownTimeframe] = useState<
    "short" | "medium" | "long"
  >("short");

  const lastLoggedWeight = [
    ...daysShortTerm,
    ...daysMediumTerm,
    ...daysLongTerm,
  ]
    .filter((day) => day.day?.userWeightInKg)
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.day?.userWeightInKg;

  function handleTimeframeChange(timeframe: "short" | "medium" | "long") {
    setShownTimeframe(timeframe);
  }

  return (
    <div className={twMerge("flex flex-col gap-3", className)} {...rest}>
      <AppHeader className="flex justify-between itecms-center">
        <span>Progreso de peso</span>

        <div>
          {timeframes.map((timeframe) => (
            <WeightTimeframeButton
              key={timeframe.value}
              isActive={shownTimeframe === timeframe.value}
              onClick={() => handleTimeframeChange(timeframe.value)}
            >
              {timeframe.label}
            </WeightTimeframeButton>
          ))}
        </div>
      </AppHeader>

      <section className="flex flex-col gap-2.5 p-3.75 pb-0 bg-white rounded-2xl">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-[20px]">
              {formatWeight(lastLoggedWeight)}
            </span>

            <span className="text-text-minor-emphasis-app text-[14px] font-medium">
              Peso actual
            </span>
          </div>

          <span>FEEDBACK</span>
        </header>

        {shownTimeframe === "short" && (
          <WeightHistory days={daysShortTerm} hideAxis />
        )}

        {shownTimeframe === "medium" && (
          <WeightHistory days={daysMediumTerm} hideAxis />
        )}

        {shownTimeframe === "long" && (
          <WeightHistory days={daysLongTerm} hideAxis />
        )}
      </section>
    </div>
  );
}

function WeightTimeframeButton({
  isActive,
  children,
  ...props
}: {
  isActive: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <button
      className={twMerge(
        `text-[14px] font-medium rounded-full p-2 cursor-pointer transition ${isActive ? "bg-white" : "text-text-minor-emphasis-app hover:bg-white/80"}`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

const timeframes: {
  label: string;
  value: "short" | "medium" | "long";
}[] = [
  { label: "Corto", value: "short" },
  { label: "Medio", value: "medium" },
  { label: "Largo", value: "long" },
];

export default WeightProgress;
