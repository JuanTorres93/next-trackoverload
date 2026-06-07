import { twMerge } from "tailwind-merge";

import BaseButton from "./BaseButton";

function ButtonAction({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <BaseButton
      className={twMerge("bg-secondary-app text-white", className)}
      {...rest}
    >
      {children}
    </BaseButton>
  );
}

export default ButtonAction;
