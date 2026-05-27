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
        "flex gap-2 border border-primary p-1 rounded-xl",
        className,
      )}
      {...rest}
    >
      {Object.values(PRICE_TIMEFRAMES).map((timeframe) => {
        const isSelected = selectedTimeframe === timeframe;

        return (
          <div
            key={timeframe}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer ${
              isSelected ? "bg-primary text-text-light" : " hover:bg-gray-200"
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
