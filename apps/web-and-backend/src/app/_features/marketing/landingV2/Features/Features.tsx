import { FiActivity } from "react-icons/fi";
import { LiaDumbbellSolid } from "react-icons/lia";
import { TbApple } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import nutritionTrackingImage from "@/../public/recipes.webp";
import weightLogImage from "@/../public/weight.webp";

import LandingSection from "../LandingSection";
import FeaturesPreview, {
  FeatureDescription,
  FeatureItemType,
  FeatureSummary,
} from "./FeaturesPreview";

function Features({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge("", className)}
      title="Designed for clarity, built to eliminate complexity."
      subtitle="Everything you need to regain control over your nutrition, habits, and self-belief."
      id="features"
      {...rest}
    >
      <FeaturesPreview features={featuresData}>
        <div className="grid grid-cols-[.7fr_1fr] gap-6 max-bp-landing-features:grid-cols-1 max-bp-landing-features:gap-10">
          <div className="flex flex-col gap-6 justify-stretch max-bp-landing-features:gap-4">
            {featuresData.map((feature) => (
              <FeatureSummary key={feature.id} feature={feature} />
            ))}
          </div>

          <FeatureDescription />
        </div>
      </FeaturesPreview>
    </LandingSection>
  );
}

const featuresData: FeatureItemType[] = [
  {
    id: "1",

    logo: <TbApple size={30} strokeWidth={1.4} />,

    summaryTitle: "Simple Nutrition Tracking",
    summarySubtitle: "No micro scale pressure. Intuitive daily estimates.",

    mainTitle: "Track nutrition without getting overwhelmed.",
    mainSubtitle:
      "Say goodbye to stressful scales and hyper-detailed scanning.",
    mainDescription:
      "Cimientos focuses exclusively on what matters: daily calories and protein. We prioritize visual indicators over extreme weighing systems. This is the simple nutrition foundation built for long-term consistency.",
    mainBullets: [
      "Custom macro boundaries created around your favorite meals.",
      "Quick-log templates for fast tracking on the go.",
    ],
    // TODO IMPORTANT: change image
    mainImageUrl: nutritionTrackingImage,
  },
  {
    id: "2",

    logo: <FiActivity size={30} strokeWidth={1.4} />,

    summaryTitle: "Calm Trends & Weight Log",
    summarySubtitle:
      "Track your actual progress over time and easily reuse previous meals for consistency.",

    mainTitle: "Calm weight tracking & short to long term trends.",
    mainSubtitle: "Track real physical progress without daily scale anxiety.",
    mainDescription:
      "Daily weight fluctuations can be discouraging. Cimientos helps you stay focused with clear 13, 30, an 90-day progress trends, while smart meal memory lets you save and reuse pre-calculated protein and calorie-focused meals with a single tap.",
    mainBullets: [
      "Short, medium, and long-term trend analysis.",
      "Instant duplication & reuse of pre-calculated staple meals.",
    ],
    mainImageUrl: weightLogImage,
  },
  {
    id: "3",

    logo: <LiaDumbbellSolid size={30} strokeWidth={0.1} />,

    summaryTitle: "Exercise Systems",
    summarySubtitle: "Straightforward gym & home routines to build strength.",

    mainTitle: "Clear workout routines designed for shy guys.",
    mainSubtitle: "No complicated gym machines or complex fitness jargon.",
    mainDescription:
      "Going to a busy gym when you feel insecure can be overwhelming. Cimientos' upcoming exercise feature will provide ste-by-step home templates and introductory dumbbell routines. No flashy posing just foundational physical strength.",
    mainBullets: [
      "Simplified workout routines to avoid overthinking.",
      "Clear progression systems to build strength without confusion.",
    ],
    // TODO IMPORTANT: change image
    mainImageUrl: weightLogImage,
  },
];

export default Features;
