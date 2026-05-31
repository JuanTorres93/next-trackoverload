import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import BulletList, { BulletItemType } from "./BulletList";
import ReasonWhyImage from "./ReasonWhyImage";

async function ReasonWhy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const t = await getTranslations("LandingPage.about");

  return (
    <LandingSection
      className={twMerge("", className)}
      title={t("heading")}
      subtitle={t("subheading")}
      id="about"
      {...rest}
    >
      <div className="grid items-end grid-cols-3 gap-8 max-bp-landing-reason-why:grid-cols-2 max-bp-landing-reason-why:grid-rows-2 max-bp-landing-reason-why-mobile:grid-cols-1 max-bp-landing-reason-why-mobile:grid-rows-auto">
        <BulletList
          listTitle={t("bad.title")}
          bullets={badBullets}
          className="max-bp-landing-reason-why:row-start-1"
        />

        <ReasonWhyImage className="max-bp-landing-reason-why:row-start-2 max-bp-landing-reason-why:col-span-2 max-bp-landing-reason-why-mobile:col-span-1" />

        <BulletList
          listTitle={t("good.title")}
          bullets={goodBullets}
          isGood
          className="max-bp-landing-reason-why:row-start-1 max-bp-landing-reason-why-mobile:row-start-3"
        />
      </div>
    </LandingSection>
  );
}

const badBullets: BulletItemType[] = [
  {
    introTranslationKey: "LandingPage.about.bad.item-1.intro",
    descriptionTranslationKey: "LandingPage.about.bad.item-1.description",
  },
  {
    introTranslationKey: "LandingPage.about.bad.item-2.intro",
    descriptionTranslationKey: "LandingPage.about.bad.item-2.description",
  },
  {
    introTranslationKey: "LandingPage.about.bad.item-3.intro",
    descriptionTranslationKey: "LandingPage.about.bad.item-3.description",
  },
  {
    introTranslationKey: "LandingPage.about.bad.item-4.intro",
    descriptionTranslationKey: "LandingPage.about.bad.item-4.description",
  },
];

const goodBullets: BulletItemType[] = [
  {
    introTranslationKey: "LandingPage.about.good.item-1.intro",
    descriptionTranslationKey: "LandingPage.about.good.item-1.description",
  },
  {
    introTranslationKey: "LandingPage.about.good.item-2.intro",
    descriptionTranslationKey: "LandingPage.about.good.item-2.description",
  },
  {
    introTranslationKey: "LandingPage.about.good.item-3.intro",
    descriptionTranslationKey: "LandingPage.about.good.item-3.description",
  },
  {
    introTranslationKey: "LandingPage.about.good.item-4.intro",
    descriptionTranslationKey: "LandingPage.about.good.item-4.description",
  },
];

export default ReasonWhy;
