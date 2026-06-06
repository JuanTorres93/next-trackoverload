import { twMerge } from "tailwind-merge";

import BaseButton from "./BaseButton";

function ButtonActionWeak({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <BaseButton
      className={twMerge("bg-transparent text-secondary-app", className)}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}

export default ButtonActionWeak;
