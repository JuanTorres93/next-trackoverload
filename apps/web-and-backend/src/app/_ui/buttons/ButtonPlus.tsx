import { FiPlus } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonPlus({
  popupVariant = false,
  ...props
}: { popupVariant?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const size = popupVariant ? 15 : 22;

  return (
    <ButtonCircle
      className={twMerge("", className)}
      popupVariant={popupVariant}
      {...rest}
    >
      <FiPlus size={size} />
    </ButtonCircle>
  );
}

export default ButtonPlus;
