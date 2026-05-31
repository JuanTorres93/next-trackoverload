import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import Step, { StepItemType } from "./Step";

async function HowItWorks({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const t = await getTranslations("LandingPage.how-it-works");

  return (
    <LandingSection
      className={twMerge("", className)}
      title={t("heading")}
      subtitle={t("subheading")}
      id="how-it-works"
      {...rest}
    >
      <div className="grid grid-cols-3 gap-6 max-bp-landing-steps:grid-cols-2 max-bp-landing-steps-smallest:grid-cols-1">
        {steps.map((step) => (
          <Step key={step.numberString} step={step} />
        ))}
      </div>
    </LandingSection>
  );
}

const steps: StepItemType[] = [
  {
    numberString: "01",
    titleTranslationKey: "LandingPage.how-it-works.step-1.title",
    descriptionTranslationKey: "LandingPage.how-it-works.step-1.description",
  },
  {
    numberString: "02",
    titleTranslationKey: "LandingPage.how-it-works.step-2.title",
    descriptionTranslationKey: "LandingPage.how-it-works.step-2.description",
  },
  {
    numberString: "03",
    titleTranslationKey: "LandingPage.how-it-works.step-3.title",
    descriptionTranslationKey: "LandingPage.how-it-works.step-3.description",
  },
];

export default HowItWorks;
