import { getTranslations } from "next-intl/server";
import { FaCheck } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

import TextExtraLarge from "@/app/_ui/typography/TextExtraLarge";
import TextLarge from "@/app/_ui/typography/TextLarge";
import TextMassive from "@/app/_ui/typography/TextMassive";

import ButtonCTA from "../../ButtonCTA";
import Tag from "./Tag";

async function PriceCard({
  price,
  ...props
}: {
  price: PriceItemType;
  isHighlighted?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const t = await getTranslations("");

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
      <Tag>{t(price.taglineTranslationKey)}</Tag>

      <div className="flex flex-col gap-2.5">
        <div>
          <TextMassive as="span" className="font-semibold font-secondary">
            {formatPrice(price.priceInEurosCents)}
          </TextMassive>

          <TextExtraLarge as="span">/month</TextExtraLarge>
        </div>

        <TextLarge>{t(price.shortDescriptionTranslationKey)}</TextLarge>
      </div>

      <TextLarge as="ul" className="flex flex-col gap-2 py-4 list-inside">
        {price.featuresTranslationKeys.map((featureTranslationKey, index) => (
          <li key={index} className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center p-1 rounded-full ${price.isFlagship ? "bg-primary-lightest/40 text-white" : "bg-gray-300 text-gray-600"}`}
            >
              <FaCheck size={8} />
            </div>

            <span>{t(featureTranslationKey)}</span>
          </li>
        ))}
      </TextLarge>

      <ButtonCTA
        href="/auth/register"
        className={`mt-auto text-center text-text ${price.isFlagship ? "bg-white border-white" : "bg-transparent border-text"}`}
        showIcon={false}
      >
        {t(price.ctaTextTranslationKey)}
      </ButtonCTA>
    </div>
  );
}

function formatPrice(priceInEurosCents: number) {
  const euros = priceInEurosCents / 100;

  return `${euros.toFixed(0)} €`;
}

export type PriceItemType = {
  priceInEurosCents: number;
  taglineTranslationKey: string;
  shortDescriptionTranslationKey: string;
  featuresTranslationKeys: string[];
  ctaTextTranslationKey: string;
  isFlagship?: boolean;
};

export default PriceCard;
