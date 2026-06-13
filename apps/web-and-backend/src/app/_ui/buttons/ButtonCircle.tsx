import Link from "next/link";

import { twMerge } from "tailwind-merge";

function ButtonCircle({
  children,
  href,
  popupVariant = false,
  ref,
  ...props
}: {
  children?: React.ReactNode;
  href?: string;
  popupVariant?: boolean;
  ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  if (href)
    return (
      <Link
        href={href}
        className={twMerge(
          `rounded-full hover:cursor-pointer transition ${popupVariant ? "bg-background-app p-1.5" : "p-2.5 bg-white hover:bg-background-app"}`,
          className,
        )}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
      </Link>
    );

  return (
    <button
      className={twMerge(
        `rounded-full hover:cursor-pointer transition ${popupVariant ? "bg-background-app p-1.5" : "p-2.5 bg-white hover:bg-background-app"}`,
        className,
      )}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ButtonCircle;
