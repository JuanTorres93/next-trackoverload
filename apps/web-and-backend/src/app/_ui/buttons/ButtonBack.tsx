import { MdOutlineArrowBack } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonBack({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonCircle className={twMerge("", className)} {...rest}>
      <MdOutlineArrowBack size={22} />
    </ButtonCircle>
  );
}

export default ButtonBack;
