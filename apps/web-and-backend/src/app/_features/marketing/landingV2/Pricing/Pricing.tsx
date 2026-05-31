import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import { getPlanInfo } from "@/app/_features/subscription/actions";
import { FREE_TRIAL_DAYS } from "@/domain/common/constants";

import LandingSection from "../LandingSection";
import PriceCard, { PriceItemType } from "./PriceCard";
import PriceTimeframeSwitch from "./PriceTimeframeSwitch";

async function Pricing({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const t = await getTranslations("LandingPage.pricing");

  const sectionTitle = t("heading");

  const planInfoJsend = await getPlanInfo();

  const errorInPriceRetrieval = planInfoJsend.status !== "success";

  if (errorInPriceRetrieval) {
    return (
      <LandingSection
        className={twMerge("", className)}
        title={sectionTitle}
        id="pricing"
        {...rest}
      >
        <div className="p-4 mb-6 text-red-800 bg-red-100 rounded">
          {/* TODO translate */}
          Hubo un error al recuperar la información de precios. Por favor,
          inténtalo de nuevo.
        </div>

        <div className="flex flex-col items-center gap-6">
          <PriceTimeframeSwitch />

          <div className="grid grid-cols-2 gap-6 max-bp-landing-price:grid-cols-1">
            {priceItems.map((item, index) => (
              <PriceCard key={index} price={item} />
            ))}
          </div>
        </div>
      </LandingSection>
    );
  }

  const flagshipPrice: PriceItemType = {
    priceInEurosCents: planInfoJsend.data.priceInEurCents,
    taglineTranslationKey: "LandingPage.pricing.paid.tag",
    shortDescriptionTranslationKey: "LandingPage.pricing.paid.subtitle",
    featuresTranslationKeys: [
      "LandingPage.pricing.common-bullets.0",
      "LandingPage.pricing.common-bullets.1",
      "LandingPage.pricing.common-bullets.2",
      "LandingPage.pricing.common-bullets.3",
      // TODO IMPORTANT: update when exercise module is released
      "LandingPage.pricing.paid.bullets.0",
    ],
    ctaTextTranslationKey: "LandingPage.pricing.paid.cta",
    isFlagship: true,
  };

  if (
    !priceItems.some(
      (item) =>
        item.taglineTranslationKey === flagshipPrice.taglineTranslationKey,
    )
  )
    priceItems.push(flagshipPrice);

  return (
    <LandingSection
      className={twMerge("", className)}
      title={sectionTitle}
      id="pricing"
      {...rest}
    >
      <div className="flex flex-col items-center gap-12">
        {/* <PriceTimeframeSwitch /> */}
        {/* <div></div> */}

        <div className="grid grid-cols-2 gap-6 max-bp-landing-price:grid-cols-1">
          {priceItems.map((item, index) => (
            <PriceCard key={index} price={item} />
          ))}
        </div>
      </div>
    </LandingSection>
  );
}

// TODO IMPORTANT: Rishad tiene que darme el texto actualizado
const priceItems: PriceItemType[] = [
  {
    priceInEurosCents: 0,
    taglineTranslationKey: "LandingPage.pricing.free.tag",
    shortDescriptionTranslationKey: "LandingPage.pricing.free.subtitle",
    featuresTranslationKeys: [
      "LandingPage.pricing.common-bullets.0",
      "LandingPage.pricing.common-bullets.1",
      "LandingPage.pricing.common-bullets.2",
      // TODO IMPORTANT: update when exercise module is released
      "LandingPage.pricing.common-bullets.3",
    ],
    ctaTextTranslationKey: "LandingPage.pricing.free.cta",
  },
];

export default Pricing;
