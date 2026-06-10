"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { twMerge } from "tailwind-merge";

import { extractCssVariable } from "@/app/_common/extractCssVariableFromGlobalsCssFile";

function MacrosChart({
  percentage,
  ...props
}: {
  percentage: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const clampedPercentage = Math.min(100, Math.max(0, Math.round(percentage)));
  const trackColor = extractCssVariable("--color-secondary-light-app");
  const progressColor = extractCssVariable("--color-primary-app");

  const progressData = [
    { value: clampedPercentage },
    { value: 100 - clampedPercentage },
  ];

  const width = 260;
  const cx = width / 2;
  const cy = 100;

  const innerRadius = 68;
  const outerRadius = 92;
  const cornerRadius = 8;

  const marginForCornerRadiusCrop = 15;
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
          data={progressData}
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
                    {clampedPercentage}%
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
      </PieChart>
    </div>
  );
}

export default MacrosChart;
