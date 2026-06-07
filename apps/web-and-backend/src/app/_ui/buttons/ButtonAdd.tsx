import { FiPlus } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

import ButtonActionWeak from "./ButtonActionWeak";

function ButtonAdd({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonActionWeak
      className={twMerge(
        "flex items-center gap-0.5 py-2.5 px-4.75 bg-white",
        className,
      )}
      {...rest}
    >
      <FiPlus size={16} />
      Add
    </ButtonActionWeak>
  );
}

export default ButtonAdd;
