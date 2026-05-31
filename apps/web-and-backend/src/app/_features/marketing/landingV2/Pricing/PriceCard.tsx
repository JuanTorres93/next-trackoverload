import { FaCheck } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

import ButtonPrimary from "@/app/_ui/buttons/ButtonPrimary";
import TextExtraLarge from "@/app/_ui/typography/TextExtraLarge";
import TextLarge from "@/app/_ui/typography/TextLarge";
import TextMassive from "@/app/_ui/typography/TextMassive";

import Tag from "./Tag";

// TODO IMPORTANT: Finish styling when design is done
function PriceCard({
  price,
  ...props
}: {
  price: PriceItemType;
  isHighlighted?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        `
        p-6 rounded-2xl flex flex-col gap-6 max-w-106 w-full
        ${price.isFlagship ? "bg-primary text-white" : "bg-gray-200"}
        `,
        className,
      )}
      {...rest}
    >
      <Tag>{price.tagline}</Tag>

      <div className="flex flex-col gap-2.5">
        <div>
          <TextMassive as="span" className="font-semibold font-secondary">
            {formatPrice(price.priceInEurosCents)}
          </TextMassive>

          <TextExtraLarge as="span">/month</TextExtraLarge>
        </div>

        <TextLarge>{price.shortDescription}</TextLarge>
      </div>

      <TextLarge as="ul" className="flex flex-col gap-2 py-4 list-inside">
        {price.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center p-1 rounded-full ${price.isFlagship ? "bg-primary-lightest/40 text-white" : "bg-gray-300 text-gray-600"}`}
            >
              <FaCheck size={8} />
            </div>

            <span>{feature}</span>
          </li>
        ))}
      </TextLarge>

      <ButtonPrimary
        href="/auth/register"
        className={`mt-auto text-center ${price.isFlagship ? "bg-white border-white" : "bg-transparent text-text border-text hover:bg-gray-300 hover:text-text"}`}
      >
        {price.ctaText}
      </ButtonPrimary>
    </div>
  );
}

function formatPrice(priceInEurosCents: number) {
  const euros = priceInEurosCents / 100;

  return `${euros.toFixed(0)} €`;
}

export type PriceItemType = {
  priceInEurosCents: number;
  tagline: string;
  shortDescription: string;
  features: string[];
  ctaText: string;
  isFlagship?: boolean;
};

export default PriceCard;
