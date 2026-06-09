import { GiQueenCrown } from "react-icons/gi";
import { HiOutlineCheck } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";

import { getPlanInfo } from "../actions";
import { formatPriceInEurCentsToString } from "../formatPriceInEurCentsToString";

async function PremiumPlanCard({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <article
      className={twMerge(
        "flex flex-col gap-4 bg-white rounded-2xl p-3.75",
        className,
      )}
      {...rest}
    >
      <CardHeader />

      <div></div>

      <Features />

      <ButtonAction>Subscribirse a Premium</ButtonAction>
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

function Features({ ...props }: React.HTMLAttributes<HTMLUListElement>) {
  const { className, ...rest } = props;

  const features = [
    "Seguimiento de macros relevantes",
    "Recetas personalizadas",
    "Planificación de comidas",
    "Plantillas de entrenamiento personalizadas",
    "Análisis de progreso",
    "Soporte prioritario",
  ];

  return (
    <ul
      className={twMerge(
        "text-[14px] font-medium flex flex-col gap-2",
        className,
      )}
      {...rest}
    >
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-1.5">
          <div className="flex items-center justify-center rounded-full size-5 bg-primary-app">
            <HiOutlineCheck size={10} strokeWidth={3} className="text-text" />
          </div>
          {feature}
        </li>
      ))}
    </ul>
  );
}

export default PremiumPlanCard;
