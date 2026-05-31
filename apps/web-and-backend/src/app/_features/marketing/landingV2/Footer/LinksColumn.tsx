import Link from "next/link";

import { twMerge } from "tailwind-merge";

import TextLarge from "@/app/_ui/typography/TextLarge";

import { NavLinkType } from "../NavLinkType";

function LinksColumn({
  columnTitle,
  links,
  ...props
}: {
  columnTitle: string;
  links: NavLinkType[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex flex-col gap-9", className)} {...rest}>
      <TextLarge as="h5" className="font-medium">
        {columnTitle}
      </TextLarge>

      <ul className="flex flex-col gap-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LinksColumn;
