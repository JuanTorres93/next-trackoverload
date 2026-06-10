import { twMerge } from "tailwind-merge";

import BaseButton from "./BaseButton";

function ButtonActionWhite({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <BaseButton
      href={href}
      className={twMerge(
        "bg-white text-text disabled:bg-background-dark-app disabled:border-background-dark-app disabled:text-text-minor-emphasis-app disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}

export default ButtonActionWhite;
