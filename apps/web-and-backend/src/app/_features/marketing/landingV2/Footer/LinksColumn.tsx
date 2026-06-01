import Link from "next/link";

import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import TextLarge from "@/app/_ui/typography/TextLarge";

import { NavLinkType } from "../NavLinkType";

async function LinksColumn({
  columnTitle,
  links,
  ...props
}: {
  columnTitle: string;
  links: NavLinkType[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const t = await getTranslations("LandingPage.footer");

  return (
    <div
      className={twMerge(
        "flex flex-col gap-9 max-bp-landing-footer-smallest:gap-6",
        className,
      )}
      {...rest}
    >
      <TextLarge as="h5" className="font-medium">
        {columnTitle}
      </TextLarge>

      <ul className="flex flex-col gap-3">
        {links.map((link, index) => (
          <li key={index} className="transition hover:text-primary-light">
            <Link href={link.href}>{t(link.translationKey)}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LinksColumn;
