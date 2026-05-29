"use client";

import { useState } from "react";

import { twMerge } from "tailwind-merge";

const PRICE_TIMEFRAMES = {
  MONTHLY: "MONTHLY",
  ANNUALLY: "ANNUALLY",
} as const;

function PriceTimeframeSwitch({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const [selectedTimeframe, setSelectedTimeframe] = useState<
    (typeof PRICE_TIMEFRAMES)[keyof typeof PRICE_TIMEFRAMES]
  >(PRICE_TIMEFRAMES.MONTHLY);

  return (
    <div
      className={twMerge(
        "flex gap-2 border border-primary-light p-1 rounded-2xl font-secondary",
        className,
      )}
      {...rest}
    >
      {Object.values(PRICE_TIMEFRAMES).map((timeframe) => {
        const isSelected = selectedTimeframe === timeframe;

        return (
          <div
            key={timeframe}
            className={`px-3 py-1 rounded-xl text-lg  transition cursor-pointer ${
              isSelected ? "bg-primary-light text-white" : " hover:bg-neutral"
            }`}
            onClick={() => setSelectedTimeframe(timeframe)}
          >
            {timeframe === PRICE_TIMEFRAMES.MONTHLY ? "Monthly" : "Annually"}
          </div>
        );
      })}
    </div>
  );
}

export default PriceTimeframeSwitch;
