import { twMerge } from "tailwind-merge";

import SquaresPattern from "@/app/_ui/SquaresPattern";

function MacroSummary({
  calories,
  protein,
  ...props
}: {
  calories: number;
  protein: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "relative p-3.75 bg-secondary-app text-white rounded-2xl flex flex-col gap-3 font-medium text-[14px] overflow-hidden",
        className,
      )}
      {...rest}
    >
      <MacroLine label="Calorías Totales" value={calories} valueUnit="kcal" />

      <div className="border-t border-white opacity-6"></div>

      <MacroLine label="Proteínas Totales" value={protein} valueUnit="g" />

      <SquaresPattern className="absolute -right-1 -top-2" />
    </div>
  );
}

function MacroLine({
  label,
  value,
  valueUnit = "",
  ...props
}: {
  label: string;
  value: number;
  valueUnit?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex justify-between", className)} {...rest}>
      <span className="opacity-60">{label}</span>

      <span>
        {value} {valueUnit}
      </span>
    </div>
  );
}

export default MacroSummary;
