import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { GoDash } from "react-icons/go";
import { DayEntry } from "shared";
import { twMerge } from "tailwind-merge";

import { analyzeWeightTrend } from "@/application-layer/use-cases/day/GetWeightFeedbackForLastNDaysUsecase/GetWeightFeedbackForLastNDaysUsecase";

function WeightTrendTag({
  dayEntries,
  ...props
}: { dayEntries: DayEntry[] } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const weights = dayEntries
    .filter((day) => day.day?.userWeightInKg !== undefined)
    .map((day) => day.day!.userWeightInKg!);
  const trend = analyzeWeightTrend(weights);

  let trendIcon = <GoDash size={16} strokeWidth={1} />;

  if (trend === "increasing") {
    trendIcon = <FaArrowUp size={16} />;
  }
  if (trend === "INCREASING") {
    trendIcon = (
      <div className="flex items-center gap-0">
        <FaArrowUp size={16} />
        <FaArrowUp size={16} />
      </div>
    );
  }

  if (trend === "decreasing") {
    trendIcon = <FaArrowDown size={16} />;
  }
  if (trend === "DECREASING") {
    trendIcon = (
      <div className="flex items-center gap-0">
        <FaArrowDown size={16} />
        <FaArrowDown size={16} />
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        `bg-background-dark-app py-1.5 px-3 rounded-full 
        ${(trend === "increasing" || trend === "decreasing") && "text-secondary-light-app bg-primary-light-app"}
        ${(trend === "INCREASING" || trend === "DECREASING") && "text-notification bg-notification/20"}
        `,
        className,
      )}
      {...rest}
    >
      {trendIcon}
    </div>
  );
}

export default WeightTrendTag;
