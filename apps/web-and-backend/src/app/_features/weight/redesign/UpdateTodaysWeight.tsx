import { twMerge } from "tailwind-merge";

import SquaresPattern from "@/app/_ui/SquaresPattern";
import { formatWeight } from "@/app/_utils/format/formatWeight";

import { handleJSENDResponse } from "../../common/handleJSENDResponse";
import { getAssembledDayById } from "../../day/actions";
import { getTodayDayId } from "../../day/utils/getTodayDayId";
import UpdateWeightToggleForm from "./UpdateWeightToggleForm";

async function UpdateTodaysWeight({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const todayDayId = getTodayDayId();

  const todayAssembledJSEND = await getAssembledDayById(todayDayId);
  const handledTodayAssembled = handleJSENDResponse(todayAssembledJSEND);

  const formattedWeight = formatWeight(
    handledTodayAssembled!.data!.assembledDay?.userWeightInKg,
  );

  return (
    <section
      className={twMerge(
        "relative text-white bg-secondary-app flex flex-col gap-4 p-3.75 rounded-[20px]",
        className,
      )}
      {...rest}
    >
      {!handledTodayAssembled.isSuccess && handledTodayAssembled.errorComponent}

      <div className="flex flex-col gap-1">
        <span className="font-medium text-[14px] opacity-60">Tu peso hoy </span>

        {handledTodayAssembled.isSuccess && (
          <span className="font-semibold text-[36px]">{formattedWeight}</span>
        )}
      </div>

      <UpdateWeightToggleForm />

      <SquaresPattern className="absolute top-0 right-0 size-50" />
    </section>
  );
}

export default UpdateTodaysWeight;
