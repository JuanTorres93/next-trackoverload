import { FiPlus } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonPlus({
  popupVariant = false,
  ref,
  ...props
}: {
  popupVariant?: boolean;

  ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const size = popupVariant ? 15 : 22;

  return (
    <ButtonCircle
      className={twMerge("", className)}
      popupVariant={popupVariant}
      ref={ref}
      {...rest}
    >
      <FiPlus size={size} />
    </ButtonCircle>
  );
}

export default ButtonPlus;
