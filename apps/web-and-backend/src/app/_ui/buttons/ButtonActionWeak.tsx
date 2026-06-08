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
      className={twMerge("bg-transparent text-secondary-app", className)}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}

export default ButtonActionWeak;
