import { HiOutlineCalendarDays } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonBatchLogging({
  popupVariant = false,
  ...props
}: { popupVariant?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const size = popupVariant ? 15 : 22;

  return (
    <ButtonCircle
      className={twMerge("", className)}
      popupVariant={popupVariant}
      {...rest}
    >
      <HiOutlineCalendarDays size={size} strokeWidth={2} />
    </ButtonCircle>
  );
}

export default ButtonBatchLogging;
