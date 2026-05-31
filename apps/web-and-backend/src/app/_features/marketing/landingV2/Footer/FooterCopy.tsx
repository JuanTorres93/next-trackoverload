import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import Logo from "@/app/_ui/Logo";
import TextEnormous from "@/app/_ui/typography/TextEnormous";
import TextSmall from "@/app/_ui/typography/TextSmall";

async function FooterCopy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const t = await getTranslations("LandingPage");

  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 max-bp-landing-footer-smallest:items-center ",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-2 max-bp-landing-footer-smallest:justify-center">
        <Logo size={36} />

        <TextEnormous as="span" className="font-medium">
          Cimientos
        </TextEnormous>
      </div>

      <TextSmall
        as="p"
        className="max-w-102 max-bp-landing-footer-smallest:max-w-none"
      >
        {t("footer.copy")}
      </TextSmall>
    </div>
  );
}

export default FooterCopy;
