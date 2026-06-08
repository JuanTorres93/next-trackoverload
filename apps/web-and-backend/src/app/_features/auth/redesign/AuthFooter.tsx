import Link from "next/link";

import { twMerge } from "tailwind-merge";

import TextLink from "@/app/_ui/typography/TextLink";

function AuthFooter({
  text,
  linkText,
  linkHref,
  ...props
}: {
  text: string;
  linkText: string;
  linkHref: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <footer className={twMerge("text-center", className)} {...rest}>
      <p className="text-[14px] text-text-minor-emphasis-app">
        {text}
        <Link href={linkHref}>
          <TextLink>{linkText}</TextLink>
        </Link>
      </p>
    </footer>
  );
}

export default AuthFooter;
