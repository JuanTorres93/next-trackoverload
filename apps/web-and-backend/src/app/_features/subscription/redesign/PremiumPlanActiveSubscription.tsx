import { twMerge } from "tailwind-merge";

import RingPattern from "@/app/_ui/RingPattern";
import ButtonAction from "@/app/_ui/buttons/ButtonAction";

import { getPlanInfo } from "../actions";
import { formatPriceInEurCentsToString } from "../formatPriceInEurCentsToString";
import ActiveSubscriptionTag from "./ActiveSubscriptionTag";

async function PremiumPlanActiveSubscription({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <article
      className={twMerge(
        "relative flex flex-col gap-4 bg-white rounded-2xl p-3.75",
        className,
      )}
      {...rest}
    >
      <CardHeader className="z-10" />

      <div></div>

      <SubscriptionInformation className="z-10" />

      <ButtonAction className="z-10">Cancelar suscripción</ButtonAction>

      <RingPattern className="absolute z-0 -top-14 -right-10 size-40" />
    </article>
  );
}

async function CardHeader({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const planInfoResponse = await getPlanInfo();

  const hasError = planInfoResponse.status !== "success";

  const price = !hasError
    ? formatPriceInEurCentsToString(planInfoResponse.data.priceInEurCents)
    : null;

  return (
    <header
      className={twMerge("flex items-center justify-between", className)}
      {...rest}
    >
      <h2 className="flex flex-col gap-3 font-medium text-text-minor-emphasis-app">
        <span className="text-[14px]">Plan Premium</span>

        <span>
          <span className="text-[26px] text-text font-semibold">{price}</span>
          <span>/mes</span>
        </span>
      </h2>

      <ActiveSubscriptionTag className="self-start" />
    </header>
  );
}

function SubscriptionInformation({
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  const { className, ...rest } = props;

  const subscriptionData = [
    {
      label: "Estado",
      value: "Activo",
    },
    {
      label: "Fecha de renovación",
      value: "20 de junio de 2024",
    },
    {
      label: "Cantidad",
      value: "5.00 €",
    },
  ];

  return (
    <ul
      className={twMerge(
        "text-[14px] font-medium flex flex-col gap-2 p-3.75 bg-background-app rounded-2xl",
        className,
      )}
      {...rest}
    >
      {subscriptionData.map(({ label, value }, index) => (
        <li
          key={index}
          className="flex items-center justify-between not-last:pb-2 not-last:border-b border-text-minor-emphasis-app/8"
        >
          <span className="text-text-minor-emphasis-app">{label}</span>

          <span>{value}</span>
        </li>
      ))}
    </ul>
  );
}

export default PremiumPlanActiveSubscription;
