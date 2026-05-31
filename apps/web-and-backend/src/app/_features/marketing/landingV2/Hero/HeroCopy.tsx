import { getTranslations } from "next-intl/server";
import { MdOutlineVideoSettings } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import TextMassive from "@/app/_ui/typography/TextMassive";

import ButtonCTA, { ButtonCTASecondary } from "../../ButtonCTA";
import Eyebrow from "./Eyebrow";

async function HeroCopy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const t = await getTranslations("LandingPage");
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex flex-col gap-4", className)} {...rest}>
      <Eyebrow />

      <TextMassive
        as="h1"
        className="font-semibold text-text leading-18 font-secondary max-bp-landing-hero:leading-14"
      >
        {t("hero.heading-1")}{" "}
        <span className="text-primary">{t("hero.heading-highlight")}</span>{" "}
        {t("hero.heading-2")}
      </TextMassive>

      <p className={`pt-1 text-text-minor-emphasis`}>{t("hero.subheading")}</p>

      <div className="flex gap-4 pt-4 max-bp-landing-hero-smallest:flex-col">
        <ButtonCTA href="/auth/register">{t("hero.cta")}</ButtonCTA>

        {/* TODO: Uncomment when I have a published video/resource */}
        {/* 
        <ButtonCTASecondary>
          <MdOutlineVideoSettings size={20} className="my-auto mr-2" />
          {t("hero.seeHowItWorks")}
        </ButtonCTASecondary>
          */}
      </div>
    </div>
  );
}

export default HeroCopy;
