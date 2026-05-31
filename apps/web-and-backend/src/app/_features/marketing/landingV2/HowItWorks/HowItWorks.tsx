import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import Step, { StepItemType } from "./Step";

// TODO IMPORTANT: Finish styling when design is done
function HowItWorks({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge("", className)}
      title="Three steps to your foundation."
      subtitle="Real physical transformation doesn't require living in the gym. We help you design your plan to blend into your current lifestyle seamlessly."
      id="how-it-works"
      {...rest}
    >
      <div className="grid grid-cols-3 gap-6">
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
    title: "Establish Your Baseline",
    description:
      "No rigid rules or high pressure. We begin by defining personalized nutrition and exercise guidelines based on your goals, schedule, activity level, and food preferences.",
  },
  {
    numberString: "02",
    title: "Set Once, Repeat Forever",
    description:
      "Since manufacturer labels estimate protein and calories, precise daily weighing is useless. Calculate your favorite staple meals once using standard labels or a scale, and duplicate them with one tap.",
  },
  {
    numberString: "03",
    title: "Build Self Respect",
    description:
      "Watch your physical body change as your self-esteem and clarity improve. Develop healthy consistency that carries over into career, social life, and mindset.",
  },
];

export default HowItWorks;
