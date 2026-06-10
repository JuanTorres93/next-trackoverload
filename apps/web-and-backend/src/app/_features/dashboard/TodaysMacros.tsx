import { HiOutlineFire, HiPlus } from "react-icons/hi2";
import { TbMeat } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import RingPattern from "@/app/_ui/RingPattern";
import ButtonActionWhite from "@/app/_ui/buttons/ButtonActionWhite";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

function TodaysMacros({
  todaysMacrosProps,
  ...props
}: {
  todaysMacrosProps: TodaysMacrosProps;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "relative bg-secondary-app text-white p-3.75 rounded-[20px] flex flex-col gap-3.75 font-semibold",
        className,
      )}
      {...rest}
    >
      <h2 className="flex flex-col gap-0.5">
        <span className="text-[12px] opacity-70 ">Macros de hoy</span>

        <span className="text-[20px]">Registra tus macros</span>
      </h2>

      <figure className="flex flex-col items-center gap-3">
        {/*  TODO implement progress chart */}
        <div>GRÁFICO</div>

        <div className="grid grid-cols-2 items-center gap-2.5">
          <MacroCard
            type="calories"
            value={todaysMacrosProps.currentCalories}
            maxValue={todaysMacrosProps.totalCalories}
          />

          <MacroCard
            type="protein"
            value={todaysMacrosProps.currentProtein}
            maxValue={todaysMacrosProps.totalProtein}
          />
        </div>
      </figure>

      <ButtonActionWhite className="flex items-center justify-center gap-2 ">
        <HiPlus size={16} strokeWidth={1} />

        <span>Añadir comida</span>
      </ButtonActionWhite>

      {/* NOTE: Different pattern in original design */}
      <RingPattern className="absolute z-0 -top-14 -right-12 size-40" />
    </div>
  );
}

function MacroCard({
  type,
  value,
  maxValue,
  ...props
}: {
  type: "calories" | "protein";
  value: number;
  maxValue: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const label = type === "calories" ? "Calorías" : "Proteínas";

  const formattedValue = formatToInteger(value);
  const formattedMaxValue = formatToInteger(maxValue);

  const Icon =
    type === "calories" ? (
      <HiOutlineFire size={22} />
    ) : (
      <TbMeat size={22} strokeWidth={1.5} />
    );

  return (
    <article
      className={twMerge(
        "flex items-center font-medium gap-1.5 bg-secondary-light-app p-2.5 rounded-xl",
        className,
      )}
      {...rest}
    >
      <figure
        className={`size-9.5 flex items-center justify-center rounded-full text-text ${
          type === "calories" ? "bg-primary-app" : "bg-active-navbar"
        }`}
      >
        {Icon}
      </figure>

      <div className="flex flex-col gap-0.5">
        <span className="text-[12px] opacity-60">{label}</span>

        <span>
          <span className="font-semibold text-[18px]">{formattedValue}/</span>

          <span className="opacity-60 text-[14px]">{formattedMaxValue}</span>
        </span>
      </div>
    </article>
  );
}

export default TodaysMacros;

export type TodaysMacrosProps = {
  totalCalories: number;
  totalProtein: number;
  currentCalories: number;
  currentProtein: number;
};
