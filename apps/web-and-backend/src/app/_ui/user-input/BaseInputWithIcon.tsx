import { twMerge } from "tailwind-merge";

import Input from "./Input";

function BaseInputWithIcon({
  as: Component = "div",
  icon,
  iconAfter,
  ...props
}: {
  as?: React.ElementType;
  icon: React.ReactNode;
  iconAfter?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <Component
      className={twMerge(
        "flex gap-2 px-3.75 items-center bg-white rounded-full border border-text-minor-emphasis-app/20 shadow-xs",
        className,
      )}
    >
      {icon}

      <Input className="w-full px-0 border-none rounded-none" {...rest} />

      {iconAfter}
    </Component>
  );
}

export default BaseInputWithIcon;
