import Link from "next/link";

import { twMerge } from "tailwind-merge";

function BaseButton({
  children,
  href,
  ...props
}: {
  href?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  if (href) {
    return (
      <Link
        href={href}
        className={twMerge(
          "font-semibold py-2.5 px-3 border transition border-secondary-app rounded-full text-[16px] hover:cursor-pointer text-center inline-block",
          className,
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={twMerge(
        "font-semibold py-2.5 px-3 border transition border-secondary-app rounded-full text-[16px] hover:cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default BaseButton;
