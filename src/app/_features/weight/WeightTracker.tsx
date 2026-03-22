'use client';

import { twMerge } from 'tailwind-merge';

import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';

import WeightHistory from './WeightHistory';
import WeightInput from './WeightInput';
import { getWeightFeedback } from './weightStats';
import CaloriesGoalInput from './CaloriesGoalInput';

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

  const moreThanOneDaysWithWeight =
    days.filter((day) => day.day?.userWeightInKg !== undefined).length > 1;

  const emptyInputBackground = moreThanOneDaysWithWeight
    ? 'placeholder:bg-primary/10'
    : 'placeholder:bg-info/20';

  return (
    <div
      className={twMerge(
        'grid grid-cols-[minmax(17rem,40rem)] gap-8',
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-4 p-4 border rounded-xl border-border/20 text-text/80 bg-card ">
        <WeightInput
          lastDay={lastDay}
          placeholderBackground={emptyInputBackground}
        />

        <div className="h-px bg-border/20" />

        <CaloriesGoalInput
          lastDay={lastDay}
          defaultCaloriesGoal={lastDefinedCaloriesGoal}
        />
      </div>

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

export default WeightTracker;
