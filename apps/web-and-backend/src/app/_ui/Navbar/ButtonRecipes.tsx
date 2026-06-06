import { PiChefHat } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

import ButtonNavbar from "./ButtonNavbar";

function ButtonRecipes({
  isActive = false,
  ...props
}: { isActive?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonNavbar
      icon={<PiChefHat size={22} />}
      isActive={isActive}
      className={twMerge("", className)}
      {...rest}
    ></ButtonNavbar>
  );
}

export default ButtonRecipes;
