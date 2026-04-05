"use client";

import { twMerge } from "tailwind-merge";

import { DayEntry } from "@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase";

import CaloriesGoalInput from "./CaloriesGoalInput";
import WeightHistory from "./WeightHistory";
import WeightInput from "./WeightInput";
import { getWeightFeedback } from "./weightStats";

function WeightTracker({
  days,
  ...props
}: { days: DayEntry[] } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const lastDay = days[days.length - 1];

  const lastDefinedCaloriesGoal = [...days]
    .reverse()
    .find((day) => day.day?.updatedCaloriesGoal !== undefined)
    ?.day?.updatedCaloriesGoal;

  const last14Days = days.slice(-14);
  const last30Days = days.slice(-30);
  const last90Days = days.slice(-90);

  const daysBetween15And30HaveNoWeight = days
    .slice(-30, -14)
    .every((day) => day.day?.userWeightInKg === undefined);

  const daysBetween31And90HaveNoWeight = days
    .slice(-90, -30)
    .every((day) => day.day?.userWeightInKg === undefined);

  const show30DaysChart = !daysBetween15And30HaveNoWeight;
  const show90DaysChart = !daysBetween31And90HaveNoWeight;

  return (
    <div className={twMerge("flex flex-col gap-8", className)} {...rest}>
      <InputsSection
        lastDay={lastDay}
        lastDefinedCaloriesGoal={lastDefinedCaloriesGoal}
      />

      <ChartSection
        title="Últimos 14 días"
        conclusion={getWeightFeedback(
          last14Days
            .map((day) => day.day?.userWeightInKg)
            .filter((weight): weight is number => weight !== undefined),
        )}
      >
        <WeightHistory days={last14Days} />
      </ChartSection>

      {show30DaysChart && (
        <ChartSection
          title="Últimos 30 días"
          conclusion={getWeightFeedback(
            last30Days
              .map((day) => day.day?.userWeightInKg)
              .filter((weight): weight is number => weight !== undefined),
          )}
        >
          <WeightHistory days={last30Days} />
        </ChartSection>
      )}

      {show90DaysChart && (
        <ChartSection
          title="Últimos 90 días"
          conclusion={getWeightFeedback(
            last90Days
              .map((day) => day.day?.userWeightInKg)
              .filter((weight): weight is number => weight !== undefined),
          )}
        >
          <WeightHistory days={last90Days} />
        </ChartSection>
      )}
    </div>
  );
}

function ChartSection({
  title,
  conclusion,
  children,
}: {
  title: string;
  conclusion: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-text-minor-emphasis">
          {title}
        </h3>
        <p className="text-sm font-medium text-primary">{conclusion}</p>
      </div>
      {children}
    </div>
  );
}

function InputsSection({
  lastDay,
  lastDefinedCaloriesGoal,
}: {
  lastDay: DayEntry;
  lastDefinedCaloriesGoal: number | undefined;
}) {
  return (
    <div className="overflow-hidden border shadow-sm border-border/30 rounded-xl bg-surface-card">
      <div className="flex max-bp-weight-input:flex-col">
        <WeightInput lastDay={lastDay} className="flex-1 p-5" />

        <div className="border-r border-border/20 max-bp-weight-input:border-r-0 max-bp-weight-input:border-b" />

        <CaloriesGoalInput
          lastDay={lastDay}
          defaultCaloriesGoal={lastDefinedCaloriesGoal}
          className="flex-1 p-5"
        />
      </div>
    </div>
  );
}

export default WeightTracker;
