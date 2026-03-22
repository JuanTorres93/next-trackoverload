'use client';

import { extractCssVariable } from '@/app/_common/extractCssVariableFromGlobalsCssFile';
import InfoBox from '@/app/_ui/InfoBox';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function WeightHistory({ days }: { days: DayEntry[] }) {
  const colorPrimary = extractCssVariable('--color-primary');
  const colorPrimaryLight = extractCssVariable('--color-primary-light');
  const colorNeutral = extractCssVariable('--color-text-minor-emphasis');
  const colorCaloriesGoal = extractCssVariable('--color-error');

  const data = processWeightHistoryForChart(days);

  if (data.length < 2) {
    const remainingDays = 2 - data.length;
    const isPlural = remainingDays > 1;

    return (
      <InfoBox>
        <span>
          Registra tu peso durante al menos 2 días para ver la evolución aquí
        </span>{' '}
        <span>
          (Te queda {remainingDays} {isPlural ? 'días' : 'día'}).
        </span>
      </InfoBox>
    );
  }

  return (
    <ResponsiveContainer className="text-primary" width="100%" height={180}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={colorPrimaryLight}
              stopOpacity={0.15}
            />
            <stop offset="95%" stopColor={colorPrimaryLight} stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: colorNeutral }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />

        <YAxis
          domain={[
            (min: number) => Math.floor(min - 0.5),
            (max: number) => Math.ceil(max + 0.5),
          ]}
          tickFormatter={(v) => `${Number(v).toFixed(1)} kg`}
          tick={{ fontSize: 12, fill: colorNeutral }}
          axisLine={false}
          tickLine={false}
          tickCount={4}
          width={70}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="weight"
          stroke={colorPrimary}
          strokeWidth={2}
          fill="url(#weightGradient)"
          dot={
            <WeightDot
              colorPrimary={colorPrimary}
              colorCaloriesGoal={colorCaloriesGoal}
            />
          }
          activeDot={{ r: 5, fill: colorPrimary }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

type ChartDataPoint = { label: string; weight: number; caloriesGoal?: number };

function WeightDot({
  cx,
  cy,
  payload,
  colorPrimary,
  colorCaloriesGoal,
}: {
  cx?: number;
  cy?: number;
  payload?: ChartDataPoint;
  colorPrimary: string;
  colorCaloriesGoal: string;
}) {
  if (cx == null || cy == null) return <g />;

  if (payload?.caloriesGoal) {
    const s = 6;
    const pts = `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`;
    return (
      <polygon
        points={pts}
        fill={colorCaloriesGoal}
        stroke="white"
        strokeWidth={2}
      />
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={colorPrimary}
      stroke="white"
      strokeWidth={2}
    />
  );
}

function processWeightHistoryForChart(days: DayEntry[]): ChartDataPoint[] {
  return days
    .filter((entry) => entry.day?.userWeightInKg != null)
    .map((entry) => {
      const { day, month } = dayIdToDayMonthYear(entry.date);

      const label = `${day}/${month}`;
      const weight = entry.day!.userWeightInKg!;
      const caloriesGoal = entry.day!.updatedCaloriesGoal;

      return {
        label,
        weight,
        ...(caloriesGoal != null ? { caloriesGoal } : {}),
      };
    });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: ChartDataPoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const dataPoint = payload[0].payload;

  return (
    <div className="px-3 py-2 font-normal bg-white rounded-lg shadow-md text-text">
      <p className="m-0">{label}</p>
      <p className="m-0">
        Peso:{' '}
        <span className="font-semibold text-primary">
          {payload[0].value} kg
        </span>
      </p>

      {dataPoint.caloriesGoal != null && (
        <p className="m-0">
          Objetivo calórico:{' '}
          <span className="font-semibold text-error">
            {dataPoint.caloriesGoal} kcal
          </span>
        </p>
      )}
    </div>
  );
}

export default WeightHistory;
