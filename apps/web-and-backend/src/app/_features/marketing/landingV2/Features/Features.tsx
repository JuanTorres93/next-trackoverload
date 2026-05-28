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

// TODO IMPORTANT: Finish styling when design is done
function Features({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge("", className)}
      title="Designed for clarity, built to eliminate complexity."
      subtitle="Everything you need to regain control over your nutrition, habits, and self-belief."
      {...rest}
    >
      <FeaturesPreview features={featuresData}>
        <div className="grid grid-cols-[.7fr_1fr] gap-6">
          <div className="flex flex-col gap-6 justify-stretch">
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

    // TODO IMPORTANT: I need to get this from Rishad
    mainTitle: "",
    mainSubtitle: "",
    mainDescription: "",
    mainBullets: [],
    mainImageUrl: weightLogImage,
  },
  {
    id: "3",

    logo: <LiaDumbbellSolid size={30} strokeWidth={0.1} />,

    summaryTitle: "Exercise Systems",
    summarySubtitle: "Straightforward gym & home routines to build strength.",

    // TODO IMPORTANT: I need to get this from Rishad
    mainTitle: "",
    mainSubtitle: "",
    mainDescription: "",
    mainBullets: [],
    // TODO IMPORTANT: change image
    mainImageUrl: weightLogImage,
  },
];

export default Features;
