import { HiOutlineFire } from "react-icons/hi2";
import { LuWeight } from "react-icons/lu";
import { PiChefHat } from "react-icons/pi";
import { TbMeat } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

function DaySummary({
  caloriesLeft,
  proteinLeft,
  mealsToday,
  currentWeight,
  ...props
}: {
  caloriesLeft: number;
  proteinLeft: number;
  mealsToday: number;
  currentWeight: number | undefined;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <section
      className={twMerge("grid grid-cols-2 grid-rows-2 gap-3.75", className)}
      {...rest}
    >
      <SummaryCard type="calories" value={caloriesLeft} />
      <SummaryCard type="protein" value={proteinLeft} />
      <SummaryCard type="meals" value={mealsToday} />
      <SummaryCard type="weight" value={currentWeight} />
    </section>
  );
}

function SummaryCard({
  type,
  value,
  ...props
}: {
  type: "calories" | "protein" | "meals" | "weight";
  value: number | undefined;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const label = getSummaryCardLabel(type);
  const unit = getSummaryCardUnit(type);
  const Icon = getSummaryIcon(type);

  return (
    <div
      className={twMerge(
        "flex items-center gap-1.5 font-medium text-[14px] text-text-minor-emphasis-app p-2.5 bg-white rounded-xl",
        className,
      )}
      {...rest}
    >
      <figure className="size-9.5 text-text rounded-full bg-primary-light-app flex items-center justify-center">
        {Icon}
      </figure>

      <div className="flex flex-col gap-0.5">
        <span>{label}</span>

        <span>
          <span className="text-text text-[18px]">
            {value !== undefined ? value : "-"}
          </span>
          <span> {unit}</span>
        </span>
      </div>
    </div>
  );
}

function getSummaryCardLabel(
  type: "calories" | "protein" | "meals" | "weight",
) {
  switch (type) {
    case "calories":
      return "Calorías restantes";
    case "protein":
      return "Proteína restante (g)";
    case "meals":
      return "Comidas hoy";
    case "weight":
      return "Peso actual (kg)";
  }
}

function getSummaryCardUnit(type: "calories" | "protein" | "meals" | "weight") {
  switch (type) {
    case "calories":
      return "kcal";
    case "protein":
      return "g";
    case "meals":
      return "comidas";
    case "weight":
      return "kg";
  }
}

function getSummaryIcon(type: "calories" | "protein" | "meals" | "weight") {
  switch (type) {
    case "calories":
      return <HiOutlineFire size={22} />;
    case "protein":
      return <TbMeat size={22} strokeWidth={1.5} />;
    case "meals":
      return <PiChefHat size={22} strokeWidth={1.5} />;
    case "weight":
      return <LuWeight size={22} />;
  }
}

export default DaySummary;
