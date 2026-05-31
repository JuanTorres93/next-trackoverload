import { getTranslations } from "next-intl/server";
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

async function Features({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const t = await getTranslations("LandingPage.features");

  return (
    <LandingSection
      className={twMerge("", className)}
      title={t("heading")}
      subtitle={t("subheading")}
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

    summaryTitleTranslationKey: "LandingPage.features.feat-1.summaryTitle",
    summarySubtitleTranslationKey:
      "LandingPage.features.feat-1.summarySubtitle",

    mainTitleTranslationKey: "LandingPage.features.feat-1.mainTitle",
    mainSubtitleTranslationKey: "LandingPage.features.feat-1.mainSubtitle",
    mainDescriptionTranslationKey:
      "LandingPage.features.feat-1.mainDescription",
    mainBulletsTranslationKeys: [
      "LandingPage.features.feat-1.mainBullets.0",
      "LandingPage.features.feat-1.mainBullets.1",
    ],
    // TODO IMPORTANT: change image
    mainImageUrl: nutritionTrackingImage,
  },
  {
    id: "2",

    logo: <FiActivity size={30} strokeWidth={1.4} />,

    summaryTitleTranslationKey: "LandingPage.features.feat-2.summaryTitle",
    summarySubtitleTranslationKey:
      "LandingPage.features.feat-2.summarySubtitle",

    mainTitleTranslationKey: "LandingPage.features.feat-2.mainTitle",
    mainSubtitleTranslationKey: "LandingPage.features.feat-2.mainSubtitle",
    mainDescriptionTranslationKey:
      "LandingPage.features.feat-2.mainDescription",
    mainBulletsTranslationKeys: [
      "LandingPage.features.feat-2.mainBullets.0",
      "LandingPage.features.feat-2.mainBullets.1",
    ],
    mainImageUrl: weightLogImage,
  },
  {
    id: "3",

    logo: <LiaDumbbellSolid size={30} strokeWidth={0.1} />,

    summaryTitleTranslationKey: "LandingPage.features.feat-3.summaryTitle",
    summarySubtitleTranslationKey:
      "LandingPage.features.feat-3.summarySubtitle",

    mainTitleTranslationKey: "LandingPage.features.feat-3.mainTitle",
    mainSubtitleTranslationKey: "LandingPage.features.feat-3.mainSubtitle",
    mainDescriptionTranslationKey:
      "LandingPage.features.feat-3.mainDescription",
    mainBulletsTranslationKeys: [
      "LandingPage.features.feat-3.mainBullets.0",
      "LandingPage.features.feat-3.mainBullets.1",
    ],
    // TODO IMPORTANT: change image
    mainImageUrl: weightLogImage,
  },
];

export default Features;
