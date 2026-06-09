import { twMerge } from "tailwind-merge";

import BaseButton from "./BaseButton";

function ButtonAction({
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
        "bg-secondary-app text-white disabled:bg-text-minor-emphasis-app disabled:border-text-minor-emphasis-app disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}

export default ButtonAction;
