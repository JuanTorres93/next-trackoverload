import { MdOutlineArrowBack } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonBack({
  popupVariant = false,
  ...props
}: { popupVariant?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonCircle
      className={twMerge("", className)}
      popupVariant={popupVariant}
      {...rest}
    >
      <MdOutlineArrowBack size={22} />
    </ButtonCircle>
  );
}

export default ButtonBack;
