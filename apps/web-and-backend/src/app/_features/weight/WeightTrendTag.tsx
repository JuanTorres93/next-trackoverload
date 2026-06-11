"use client";
import { useEffect, useState } from "react";

import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { GoDash } from "react-icons/go";
import { twMerge } from "tailwind-merge";

import { handleJSENDResponse } from "../common/handleJSENDResponse";
import { getWeightFeedbackForLastNDays } from "../day/actions";

function WeightTrendTag({
  numberOfDays,
  ...props
}: {
  numberOfDays: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const [trend, setTrend] = useState<string | null>("stable");
  const [errorInTrend, setErrorInTrend] = useState(false);

  useEffect(() => {
    async function fetchFeedback() {
      const feedbackJSEND = await getWeightFeedbackForLastNDays(numberOfDays);

      const handledFeedback = handleJSENDResponse(feedbackJSEND);

      if (!handledFeedback.isSuccess) {
        setErrorInTrend(true);
      } else {
        setErrorInTrend(false);
      }

      setTrend(handledFeedback.isSuccess ? handledFeedback.data : "stable");
    }

    fetchFeedback();
  }, [numberOfDays]);

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
      {errorInTrend && (
        <span className="font-medium text-notification/50">Error</span>
      )}
      {!errorInTrend && trendIcon}
    </div>
  );
}

export default WeightTrendTag;
