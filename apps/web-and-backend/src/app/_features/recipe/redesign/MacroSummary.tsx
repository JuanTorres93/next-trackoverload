import { twMerge } from "tailwind-merge";

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

function SquaresPattern({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "size-36.5 opacity-11 [background:repeating-conic-gradient(transparent_0_90deg,white_0_180deg)_0_0/50%_50%] mask-[linear-gradient(to_left,black_0%,black_10%,transparent)]",
        className,
      )}
      {...rest}
    ></div>
  );
}

export default MacroSummary;
