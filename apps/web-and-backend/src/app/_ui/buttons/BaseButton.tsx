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

  // TODO: disabled state for links and button in the components that use BaseButton
  if (href) {
    return (
      <Link
        href={href}
        className={twMerge(
          "font-semibold py-2.5 border border-secondary-app rounded-full text-[16px] hover:cursor-pointer text-center inline-block",
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
        "font-semibold py-2.5 border border-secondary-app rounded-full text-[16px] hover:cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default BaseButton;
