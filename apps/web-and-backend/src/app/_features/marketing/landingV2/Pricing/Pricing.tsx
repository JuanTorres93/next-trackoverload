import { twMerge } from "tailwind-merge";

import { getPlanInfo } from "@/app/_features/subscription/actions";
import { FREE_TRIAL_DAYS } from "@/domain/common/constants";

import LandingSection from "../LandingSection";
import PriceCard, { PriceItemType } from "./PriceCard";
import PriceTimeframeSwitch from "./PriceTimeframeSwitch";

// TODO IMPORTANT: Finish styling when design is done
async function Pricing({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const sectionTitle = "Build the foundation.";

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

  const flagshipPrice = {
    priceInEurosCents: planInfoJsend.data.priceInEurCents,
    tagline: "Pro",
    shortDescription: `The complete foundation system`,
    features: [
      "Essential macro tracking (protein and calories).",
      "Advanced progress dashboard.",
      "Custom food & meals templates.",
      // TODO IMPORTANT: update when exercise module is released
      "Exercise tracking (when released).",
      "Priority support.",
    ],
    ctaText: "Start Building Your Foundation",
    isFlagship: true,
  };

  if (!priceItems.some((item) => item.tagline === flagshipPrice.tagline))
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
    tagline: "Free",
    shortDescription: `Free Trial to ${FREE_TRIAL_DAYS} days`,
    features: [
      "Essential macro tracking (protein and calories).",
      "Advanced progress dashboard.",
      "Custom food & meals templates.",
      // TODO IMPORTANT: update when exercise module is released
      "Exercise tracking (when released).",
    ],
    ctaText: "Get Started Free",
  },
];

export default Pricing;
