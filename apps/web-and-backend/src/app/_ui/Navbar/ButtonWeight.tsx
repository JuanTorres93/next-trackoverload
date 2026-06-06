import { LuWeight } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import ButtonNavbar from "./ButtonNavbar";

function ButtonWeight({
  isActive = false,
  ...props
}: { isActive?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonNavbar
      icon={<LuWeight size={22} />}
      isActive={isActive}
      className={twMerge("", className)}
      {...rest}
    ></ButtonNavbar>
  );
}

export default ButtonWeight;
