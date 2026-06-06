import { GoBell } from "react-icons/go";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonNotifications({
  hasNotifications = true,
  ...props
}: {
  hasNotifications?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonCircle className={twMerge("", className)} {...rest}>
      <div className="relative">
        <GoBell size={22} />
        {hasNotifications && (
          <div className="absolute w-3 h-3 border-2 rounded-full bg-notification -top-1 -right-1 border-background-app"></div>
        )}
      </div>
    </ButtonCircle>
  );
}

export default ButtonNotifications;
