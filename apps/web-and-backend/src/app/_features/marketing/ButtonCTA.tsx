import { LuArrowUpRight } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import ButtonPrimary from "../../_ui/buttons/ButtonPrimary";

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
        `bg-primary border-primary font-medium text-white max-bp-change-font:py-2 duration-300 hover:bg-text hover:border-text`,
        className,
      )}
      {...rest}
    >
      {children}

      {showIcon && <LuArrowUpRight size={26} className="pt-0.5 ml-2" />}
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
        "bg-transparent flex border-primary text-primary hover:border-primary hover:text-white hover:bg-primary max-bp-change-font:py-3.25",
        className,
      )}
      {...rest}
    >
      {children}
    </ButtonCTA>
  );
}

export default ButtonCTA;
