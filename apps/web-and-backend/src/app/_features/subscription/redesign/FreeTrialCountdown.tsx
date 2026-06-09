import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import { addDaysToDate, differenceInDays } from "@/app/_utils/compute/dates";
import { formatDate } from "@/app/_utils/format/formatDate";
import { FREE_TRIAL_DAYS } from "@/domain/common/constants";

import { getLoggedInUser } from "../../user/actions";
import ActiveSubscriptionTag from "./ActiveSubscriptionTag";

async function FreeTrialCountdown({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const loggedInUser = await getLoggedInUser();

  const hasError = loggedInUser.status !== "success";

  if (hasError || !loggedInUser.data) {
    // TODO IMPORTANT handle error properly
    return null;
  }

  const loggedInUserData = loggedInUser.data;

  if (loggedInUserData?.subscriptionStatus !== "free_trial") return null;

  const dateTrialEnds = addDaysToDate(
    new Date(loggedInUserData.createdAt),
    FREE_TRIAL_DAYS,
  );

  const formattedDateTrialEnds = formatDate(dateTrialEnds);

  const daysToTrialEnd = differenceInDays(
    dateTrialEnds,
    new Date(loggedInUserData.createdAt),
  );

  return (
    <section
      className={twMerge(
        "flex flex-col gap-4.5 bg-white p-3.75 rounded-2xl",
        className,
      )}
      {...rest}
    >
      <section className="flex flex-col gap-3">
        <ActiveSubscriptionTag />

        <h2 className="flex flex-col gap-1">
          <span className="font-semibold text-[26px]">
            Prueba de {FREE_TRIAL_DAYS} días
          </span>

          <span className="font-medium text-[14px] text-text-minor-emphasis-app">
            Tu periodo de prueba está en curso
          </span>
        </h2>

        <Countdown
          totalTrialDays={FREE_TRIAL_DAYS}
          remainingDays={daysToTrialEnd}
        />
      </section>

      {/* <ButtonAction className="mt-1">Gestionar Suscripción</ButtonAction> */}

      <p className="text-text-minor-emphasis-app font-medium text-[14px] text-center">
        Tu periodo de prueba termina el {formattedDateTrialEnds}.
      </p>
    </section>
  );
}

function Countdown({
  totalTrialDays,
  remainingDays,
  ...props
}: {
  totalTrialDays: number;
  remainingDays: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "p-3.75 bg-background-app rounded-2xl flex flex-col gap-3.75",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-1.5 font-medium text-[14px] text-text-minor-emphasis-app">
        <span className="text-text font-semibold text-[24px]">
          {remainingDays}
        </span>
        <span>Días Restantes</span>
      </div>

      <div className="flex flex-col gap-1">
        <progress
          className="w-full h-3.75 rounded-2xl bg-background-dark-app   [&::-webkit-progress-value]:bg-secondary-light-app [&::-moz-progress-bar]:bg-secondary-light-app"
          value={totalTrialDays - remainingDays}
          max={totalTrialDays}
        ></progress>

        <span className="text-text-minor-emphasis-app font-medium text-[14px]">
          Quedan {remainingDays} de {totalTrialDays} días
        </span>
      </div>
    </div>
  );
}

export default FreeTrialCountdown;
