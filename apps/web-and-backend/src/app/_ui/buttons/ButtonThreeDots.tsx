import { BsThreeDots } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonThreeDots({
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonCircle className={twMerge("", className)} {...rest}>
      <BsThreeDots size={17} />
    </ButtonCircle>
  );
}

export default ButtonThreeDots;
