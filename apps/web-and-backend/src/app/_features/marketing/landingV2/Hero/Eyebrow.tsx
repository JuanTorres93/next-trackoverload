import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import TextSmall from "@/app/_ui/typography/TextSmall";

async function Eyebrow({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const t = await getTranslations("LandingPage");

  return (
    <TextSmall
      as="h3"
      className={twMerge(
        `uppercase inline-block text-primary py-2.75 px-5 w-fit rounded-full bg-primary-lightest`,
        className,
      )}
      {...rest}
    >
      {t("hero.eyebrow")}
    </TextSmall>
  );
}

export default Eyebrow;
