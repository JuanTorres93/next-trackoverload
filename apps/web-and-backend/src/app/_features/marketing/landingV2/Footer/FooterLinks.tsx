import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import LinksColumn from "./LinksColumn";

async function FooterLinks({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const t = await getTranslations("LandingPage");
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge("flex gap-32 max-bp-landing-footer:gap-16", className)}
      {...rest}
    >
      {footerLinks.map((column, index) => (
        <LinksColumn
          key={index}
          columnTitle={t(`footer.${column.columnTitle}`)}
          links={column.links}
        />
      ))}
    </div>
  );
}

const footerLinks = [
  {
    columnTitle: "home",
    links: [
      { translationKey: "about", href: "/#about" },
      { translationKey: "how-it-works", href: "/#how-it-works" },
      { translationKey: "features", href: "/#features" },
      { translationKey: "testimonials", href: "/#testimonials" },
      { translationKey: "pricing", href: "/#pricing" },
    ],
  },
  //{
  //  columnTitle: "Features",
  //  links: [
  //    { translationKey: "Feature 1", href: "#" },
  //    { translationKey: "Feature 2", href: "#" },
  //    { translationKey: "Feature 3", href: "#" },
  //    { translationKey: "ETC...", href: "#" },
  //  ],
  //},
  {
    columnTitle: "pricing",
    links: [
      { translationKey: "pricing-column.basic", href: "/#pricing" },
      { translationKey: "pricing-column.premium", href: "/#pricing" },
    ],
  },
];

export default FooterLinks;
