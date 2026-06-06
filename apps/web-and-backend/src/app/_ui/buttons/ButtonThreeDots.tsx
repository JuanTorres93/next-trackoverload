import { BsThreeDots } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonThreeDots({
  popupVariant = false,
  ...props
}: { popupVariant?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const size = popupVariant ? 14 : 17;

  return (
    <ButtonCircle
      className={twMerge("", className)}
      popupVariant={popupVariant}
      {...rest}
    >
      <BsThreeDots size={size} />
    </ButtonCircle>
  );
}

export default ButtonThreeDots;
