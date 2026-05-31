import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import TextLarge from "@/app/_ui/typography/TextLarge";

async function CEOCopy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const t = await getTranslations("LandingPage.ceo");

  return (
    <div
      className={twMerge(
        "bg-white flex flex-col gap-6 justify-center px-8.5 py-13 rounded-2xl max-bp-landing-CEO-smallest:border max-bp-landing-CEO-smallest:border-primary-lightest",
        className,
      )}
      {...rest}
    >
      <h3 className="text-[28px] font-medium text-primary">
        {t("quote.title")}
      </h3>

      <TextLarge as="div" className="flex flex-col gap-4.5">
        <p>{t("quote.description.p1")}</p>

        <p>{t("quote.description.p2")}</p>

        <p className="pt-2">{t("quote.description.p3")}</p>

        <ul className="list-disc list-inside ">
          <li>{t("quote.description.bullets.0")}</li>

          <li>{t("quote.description.bullets.1")}</li>

          <li>{t("quote.description.bullets.2")}</li>
        </ul>

        <p>{t("quote.description.p4")}</p>
      </TextLarge>
    </div>
  );
}

export default CEOCopy;
