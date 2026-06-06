import { RxCross2 } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonClose({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonCircle className={twMerge("bg-background", className)} {...rest}>
      <RxCross2 size={17} />
    </ButtonCircle>
  );
}

export default ButtonClose;
