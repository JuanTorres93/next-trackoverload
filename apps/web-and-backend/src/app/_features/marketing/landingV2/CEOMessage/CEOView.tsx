import Image from "next/image";

import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import ceoImage from "@/../public/yo-cimientos.webp";
import TextEnormous from "@/app/_ui/typography/TextEnormous";

async function CEOView({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const t = await getTranslations("LandingPage.ceo");

  return (
    <div
      className={twMerge("flex flex-col gap-5 text-white", className)}
      {...rest}
    >
      <div className="relative h-full overflow-hidden aspect-4/5 rounded-2xl max-bp-landing-CEO-smallest:h-120 max-bp-landing-CEO-smallest:aspect-auto">
        <Image
          src={ceoImage}
          alt={"Hero Image"}
          fill
          className="object-cover"
        />
      </div>

      <div className="px-4 py-2 bg-primary-light rounded-2xl">
        <TextEnormous as="h3" className="font-semibold font-secondary">
          Juan Torres
        </TextEnormous>

        <h4>{t("company-position")}</h4>
      </div>
    </div>
  );
}

export default CEOView;
