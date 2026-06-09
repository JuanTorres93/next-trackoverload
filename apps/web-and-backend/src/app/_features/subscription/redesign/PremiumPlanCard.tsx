import { GiQueenCrown } from "react-icons/gi";
import { twMerge } from "tailwind-merge";

import { getPlanInfo } from "../actions";
import { formatPriceInEurCentsToString } from "../formatPriceInEurCentsToString";

async function PremiumPlanCard({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <article
      className={twMerge("bg-white rounded-2xl p-3.75", className)}
      {...rest}
    >
      <CardHeader />
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
          <span>/mes · Después de la prueba gratuita</span>
        </span>
      </h2>

      <figure>
        <GiQueenCrown className="text-yellow-500" size={61} />
      </figure>
    </header>
  );
}

export default PremiumPlanCard;
