'use client';

import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import {
  Area,
  AreaChart,
  Dot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PRIMARY_COLOR = '#008236';
const PRIMARY_LIGHT_COLOR = '#00a63e';
const NEUTRAL_COLOR = '#9ca3af';

function WeightHistory({ days }: { days: DayEntry[] }) {
  const data = processWeightHistoryForChart(days);

  if (data.length < 2) return null;

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
              stopColor={PRIMARY_LIGHT_COLOR}
              stopOpacity={0.15}
            />
            <stop
              offset="95%"
              stopColor={PRIMARY_LIGHT_COLOR}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: NEUTRAL_COLOR }}
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
          tick={{ fontSize: 12, fill: NEUTRAL_COLOR }}
          axisLine={false}
          tickLine={false}
          tickCount={4}
          width={70}
        />

        <Tooltip
          formatter={(value) => [`${value} kg`, 'Peso']}
          contentStyle={{
            borderRadius: '0.5rem',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />

        <Area
          type="monotone"
          dataKey="weight"
          stroke={PRIMARY_COLOR}
          strokeWidth={2}
          fill="url(#weightGradient)"
          dot={
            <Dot r={4} fill={PRIMARY_COLOR} stroke="white" strokeWidth={2} />
          }
          activeDot={{ r: 5, fill: PRIMARY_COLOR }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

type ChartDataPoint = { label: string; weight: number };

function processWeightHistoryForChart(days: DayEntry[]): ChartDataPoint[] {
  return days
    .filter((entry) => entry.day?.userWeightInKg != null)
    .map((entry) => {
      const { day, month } = dayIdToDayMonthYear(entry.date);

      const label = `${day}/${month}`;
      const weight = entry.day!.userWeightInKg!;

      return {
        label,
        weight,
      };
    });
}

export default WeightHistory;
