import { LuArrowUpRight } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import ButtonPrimary from "../../../_ui/buttons/ButtonPrimary";

type ButtonCTAProps = React.ComponentProps<typeof ButtonPrimary>;

function ButtonCTA({
  children,
  showIcon = true,
  className,
  ...rest
}: { showIcon?: boolean } & ButtonCTAProps) {
  return (
    <ButtonPrimary
      className={twMerge(
        "bg-primary-light border-primary-light text-text-light hover:bg-primary-light/50 hover:border-primary-light/50!",
        className,
      )}
      {...rest}
    >
      {children}

      {showIcon && <LuArrowUpRight size={20} className="inline-block ml-2" />}
    </ButtonPrimary>
  );
}

export function ButtonCTASecondary({
  children,
  className,
  ...rest
}: ButtonCTAProps) {
  return (
    <ButtonCTA
      showIcon={false}
      className={twMerge(
        "bg-transparent flex border-primary-light text-primary-light hover:bg-primary-light/10 hover:border-primary-light/50!",
        className,
      )}
      {...rest}
    >
      {children}
    </ButtonCTA>
  );
}

export default ButtonCTA;
