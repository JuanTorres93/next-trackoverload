import { twMerge } from "tailwind-merge";

import { FREE_TRIAL_DAYS } from "@/domain/common/constants";

import LandingSection from "../LandingSection";
import PriceCard, { PriceItemType } from "./PriceCard";

// TODO IMPORTANT: Finish styling when design is done
function Pricing({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge("", className)}
      title="Start with nutrition. Build the foundation."
      {...rest}
    >
      <div className="flex flex-col items-center gap-6">
        <div>MONTHLY / ANNUALLY</div>

        <div className="grid grid-cols-2 gap-6">
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
      "Simple nutrition tracking.",
      "Daily calories & protein targets.",
      "Basec food database access.",
      "14-day progress overview.",
    ],
    ctaText: "Get Started Free",
  },
  {
    priceInEurosCents: 500,
    tagline: "Pro",
    shortDescription: `The complete foundation system`,
    features: [
      // TODO IMPORTANT: remove this item, since it won't never be true
      "Full macro tracking (carbs, fat, fiber).",
      "Advanced progress dashboard.",
      "Custom food & meals templates.",
      "Weekly insights & recommendations.",
      "Priority support.",
      // TODO IMPORTANT: update when exercise module is released
      "Exercise tracking (when released).",
    ],
    ctaText: "Start Building Your Foundation",
    isFlagship: true,
  },
];

export default Pricing;
