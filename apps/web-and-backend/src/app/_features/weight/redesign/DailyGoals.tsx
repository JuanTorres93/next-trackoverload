import { HiOutlineFire } from "react-icons/hi2";
import { TbMeat } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import AppHeader from "@/app/_ui/typography/AppHeader";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

import { handleJSENDResponse } from "../../common/handleJSENDResponse";
import { getLastDayWithCaloriesGoalForUser } from "../../day/actions";
import ToggleForm from "./ToggleForm";
import UpdateGoalsForm from "./UpdateGoalsForm";

async function DailyGoals({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const lastDayWithCaloriesGoalJSEND =
    await getLastDayWithCaloriesGoalForUser();

  const handledLastDayWithCalories = handleJSENDResponse(
    lastDayWithCaloriesGoalJSEND,
  );

  return (
    <section
      className={twMerge(
        "bg-white p-3.75 rounded-xl flex flex-col gap-3",
        className,
      )}
      {...rest}
    >
      <AppHeader>Objetivos diarios</AppHeader>

      <div className="grid grid-cols-2 gap-3.75 mb-2">
        {!handledLastDayWithCalories.isSuccess &&
          handledLastDayWithCalories.errorComponent}

        {handledLastDayWithCalories.isSuccess && (
          <GoalCard
            type="calories"
            value={handledLastDayWithCalories?.data?.updatedCaloriesGoal ?? -1}
          />
        )}

        <GoalCard type="protein" value={150} />
      </div>

      <ToggleForm
        toggleButton={<ButtonAction>Actualizar objetivos</ButtonAction>}
      >
        <UpdateGoalsForm />
      </ToggleForm>
    </section>
  );
}

function GoalCard({
  type,
  value,
  ...props
}: {
  type: "calories" | "protein";
  value: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const label = type === "calories" ? "Calorías" : "Proteínas";

  const formattedValue = value < 0 ? "-" : formatToInteger(value);

  const unit = type === "calories" ? "kcal" : "g";

  const Icon =
    type === "calories" ? (
      <HiOutlineFire size={22} />
    ) : (
      <TbMeat size={22} strokeWidth={1.5} />
    );

  return (
    <article
      className={twMerge(
        "flex items-center font-medium gap-1.5 bg-background-app p-2.5 rounded-xl",
        className,
      )}
      {...rest}
    >
      <figure
        className={`size-9.5 flex items-center justify-center rounded-full text-text bg-primary-light-app`}
      >
        {Icon}
      </figure>

      <div className="flex flex-col gap-0.5">
        <span className="text-[12px] opacity-60">{label}</span>

        <span>
          <span className="font-semibold text-[18px]">{formattedValue}</span>

          <span className="opacity-60 text-[14px]"> {unit}</span>
        </span>
      </div>
    </article>
  );
}

export default DailyGoals;
