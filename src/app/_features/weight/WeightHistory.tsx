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
  const weightEntries = data.filter((d) => d.weight !== null);

  if (weightEntries.length < 2) {
    const remainingDays = 2 - weightEntries.length;
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

          <linearGradient id="estimatedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colorNeutral} stopOpacity={0.12} />
            <stop offset="95%" stopColor={colorNeutral} stopOpacity={0} />
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

        {/* Estimated line — bottom layer */}
        <Area
          type="monotone"
          dataKey="weightEstimated"
          connectNulls={true}
          stroke={colorNeutral}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          fill="url(#estimatedGradient)"
          dot={<CaloriesGoalDot colorCaloriesGoal={colorCaloriesGoal} />}
          activeDot={false}
        />

        {/* Real data line — top layer */}
        <Area
          type="monotone"
          dataKey="weight"
          connectNulls={false}
          stroke={colorPrimary}
          strokeWidth={2}
          fill="url(#weightGradient)"
          dot={
            <WeightDot
              colorPrimary={colorPrimary}
              colorCaloriesGoal={colorCaloriesGoal}
            />
          }
          activeDot={{
            r: 5,
            fill: colorPrimary,
            stroke: 'white',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

type ChartDataPoint = {
  label: string;
  weight: number | null;
  weightEstimated: number | null;
  caloriesGoal?: number;
};

function CaloriesGoalDot({
  cx,
  cy,
  payload,
  colorCaloriesGoal,
}: {
  cx?: number;
  cy?: number;
  payload?: ChartDataPoint;
  colorCaloriesGoal: string;
}) {
  // Only render when there's a calories goal but no real weight (already covered by WeightDot otherwise)
  if (
    cx == null ||
    cy == null ||
    !payload?.caloriesGoal ||
    payload.weight != null
  )
    return <g />;

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
  if (cx == null || cy == null || payload?.weight == null) return <g />;

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
  const points = days.map((entry) => {
    const { day, month } = dayIdToDayMonthYear(entry.date);
    const weight = entry.day?.userWeightInKg ?? null;
    const caloriesGoal = entry.day?.updatedCaloriesGoal;

    return {
      label: `${day}/${month}`,
      weight,
      ...(caloriesGoal != null ? { caloriesGoal } : {}),
    };
  });

  // Find last real weight index to extend estimation forward
  const lastRealIdx = points.reduce(
    (last, p, i) => (p.weight !== null ? i : last),
    -1,
  );

  return points.map((point, i) => ({
    ...point,
    weightEstimated:
      point.weight !== null
        ? point.weight
        : i <= lastRealIdx
          ? null // gaps before/between real points: let connectNulls handle them
          : (points[lastRealIdx]?.weight ?? null), // after last real: flat line
  }));
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

  if (dataPoint.weight === null) {
    return (
      <div className="px-3 py-2 font-normal bg-white rounded-lg shadow-md text-text">
        <p className="m-0">{label}</p>
        <p className="m-0 italic text-text-minor-emphasis">
          Sin registro de peso
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

  return (
    <div className="px-3 py-2 font-normal bg-white rounded-lg shadow-md text-text">
      <p className="m-0">{label}</p>
      <p className="m-0">
        Peso:{' '}
        <span className="font-semibold text-primary">
          {dataPoint.weight!.toFixed(1)} kg
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
