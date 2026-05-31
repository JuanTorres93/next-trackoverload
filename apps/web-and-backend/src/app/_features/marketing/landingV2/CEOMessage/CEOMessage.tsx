import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import CEOCopy from "./CEOCopy";
import CEOView from "./CEOView";

async function CEOMessage({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const t = await getTranslations("LandingPage.ceo");

  return (
    <LandingSection
      className={twMerge(
        "relative overflow-hidden rounded-4xl py-20 max-bp-landing-CEO-smallest:pb-0",
        className,
      )}
      title={t("heading")}
      {...rest}
    >
      <div className="relative z-3 grid grid-cols-[.35fr_1fr] gap-7.5 max-bp-landing-CEO:grid-cols-[.55fr_1fr] max-bp-landing-CEO-smallest:grid-cols-1 max-bp-landing-CEO-smallest:gap-12">
        <CEOView />

        <CEOCopy />
      </div>

      {/* Gradients */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-25 h-300 w-220 bg-radial from-primary-light/30 via-primary-lightest/20 to-transparent blur-2xl" />

        <div className="absolute -top-30 -right-30 h-300 w-192.25 bg-radial from-primary-light/30 via-primary-lightest/20 to-transparent blur-2xl" />
      </div>
    </LandingSection>
  );
}

export default CEOMessage;
