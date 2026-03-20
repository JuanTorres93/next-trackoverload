'use client';

import { twMerge } from 'tailwind-merge';

import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';

import WeightHistory from './WeightHistory';
import WeightInput from './WeightInput';
import { getWeightFeedback } from './weightStats';

function WeightTracker({
  days,
  ...props
}: { days: DayEntry[] } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const lastDay = days[days.length - 1];
  const last14Days = days.slice(-14);
  const last30Days = days.slice(-30);
  const last90Days = days.slice(-90);

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
      <WeightInput
        lastDay={lastDay}
        placeholderBackground={emptyInputBackground}
      />

      <ChartTitle>Últimos 14 días</ChartTitle>
      <ChartConclusion>
        {getWeightFeedback(
          last14Days
            .map((day) => day.day?.userWeightInKg)
            .filter((weight): weight is number => weight !== undefined),
        )}
      </ChartConclusion>
      <WeightHistory days={last14Days} />

      <ChartTitle>Últimos 30 días</ChartTitle>
      <ChartConclusion>
        {getWeightFeedback(
          last30Days
            .map((day) => day.day?.userWeightInKg)
            .filter((weight): weight is number => weight !== undefined),
        )}
      </ChartConclusion>
      <WeightHistory days={last30Days} />

      <ChartTitle>Últimos 90 días</ChartTitle>
      <ChartConclusion>
        {getWeightFeedback(
          last90Days
            .map((day) => day.day?.userWeightInKg)
            .filter((weight): weight is number => weight !== undefined),
        )}
      </ChartConclusion>
      <WeightHistory days={last90Days} />
    </div>
  );
}

function ChartTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-medium text-primary/80">{children}</h3>;
}

function ChartConclusion({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-primary/80">{children}</p>;
}

export default WeightTracker;
