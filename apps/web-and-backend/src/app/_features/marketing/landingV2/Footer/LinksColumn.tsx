import Link from "next/link";

import { twMerge } from "tailwind-merge";

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
      <h5 className="text-lg font-medium">{columnTitle}</h5>

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
