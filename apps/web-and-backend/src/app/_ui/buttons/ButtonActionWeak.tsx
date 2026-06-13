import { twMerge } from "tailwind-merge";

import BaseButton from "./BaseButton";

function ButtonActionWeak({
  children,
  href,
  ...props
}: {
  href?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <BaseButton
      href={href}
      className={twMerge(
        "bg-transparent text-secondary-app disabled:border-text-minor-emphasis-app disabled:text-text-minor-emphasis-app disabled:cursor-not-allowed hover:bg-background-app/80",
        className,
      )}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}

export default ButtonActionWeak;
