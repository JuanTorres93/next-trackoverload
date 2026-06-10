"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { twMerge } from "tailwind-merge";

import { extractCssVariable } from "@/app/_common/extractCssVariableFromGlobalsCssFile";

function MacrosChart({
  totalCalories,
  totalProtein,
  currentCalories,
  currentProtein,
  ...props
}: {
  totalCalories: number;
  totalProtein: number;
  currentCalories: number;
  currentProtein: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const caloriesPercentage = clampPercentage(currentCalories, totalCalories);
  const proteinPercentage = clampPercentage(currentProtein, totalProtein);

  const combinedPercentage = getCombinedPercentage(
    caloriesPercentage,
    proteinPercentage,
  );

  const trackColor = extractCssVariable("--color-secondary-light-app");
  const progressColor = extractCssVariable("--color-primary-app");
  const proteinColor = extractCssVariable("--color-active-navbar");

  const caloriesData = [
    { value: caloriesPercentage },
    { value: 100 - caloriesPercentage },
  ];

  const proteinData = [
    { value: proteinPercentage },
    { value: 100 - proteinPercentage },
  ];

  const width = 260;
  const cx = width / 2;
  const cy = 100;

  const outerRadius = 92;
  const innerRadius = 68;
  const proteinInnerRadius = 86;
  const cornerRadius = 8;

  const marginForCornerRadiusCrop = 12.5;
  const height = outerRadius + marginForCornerRadiusCrop;

  return (
    <div className={twMerge("", className)} {...rest}>
      <PieChart width={width} height={height}>
        <Pie
          data={[{ value: 100 }]}
          cx={cx}
          cy={cy}
          startAngle={180}
          endAngle={0}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill={trackColor}
          dataKey="value"
          stroke="none"
          isAnimationActive={false}
          cornerRadius={cornerRadius}
        />
        <Pie
          data={[{ value: 100 }]}
          cx={cx}
          cy={cy}
          startAngle={180}
          endAngle={0}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill={trackColor}
          dataKey="value"
          stroke="none"
          isAnimationActive={false}
          cornerRadius={cornerRadius}
        />
        <Pie
          data={caloriesData}
          cx={cx}
          cy={cy}
          startAngle={180}
          endAngle={0}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          stroke="none"
          cornerRadius={cornerRadius}
        >
          <Cell fill={progressColor} />
          <Cell fill="transparent" />

          <Label
            content={({ viewBox }) => {
              const { cx, cy } = viewBox as { cx: number; cy: number };

              const centeredY = cy + 50;
              const centeredX = cx + 5;

              return (
                <g>
                  <text
                    x={centeredX}
                    y={centeredY - 22}
                    textAnchor="middle"
                    fill="white"
                    fontSize="30"
                    fontWeight="600"
                  >
                    {combinedPercentage}%
                  </text>
                  <text
                    x={centeredX}
                    y={centeredY - 5}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.6)"
                    fontSize="11"
                  >
                    of daily goals
                  </text>
                </g>
              );
            }}
          />
        </Pie>

        <Pie
          data={proteinData}
          cx={cx}
          cy={cy}
          startAngle={180}
          endAngle={0}
          innerRadius={proteinInnerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          stroke="none"
          cornerRadius={cornerRadius}
        >
          <Cell fill={proteinColor} />
          <Cell fill="transparent" />
        </Pie>
      </PieChart>
    </div>
  );
}

function clampPercentage(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
}

function getCombinedPercentage(
  caloriesPercentage: number,
  proteinPercentage: number,
): number {
  const combined = (caloriesPercentage + proteinPercentage) / 2;
  return Math.min(100, Math.max(0, Math.round(combined)));
}

export default MacrosChart;
