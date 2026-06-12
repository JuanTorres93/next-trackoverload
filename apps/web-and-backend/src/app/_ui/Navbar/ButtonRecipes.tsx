import { PiChefHat } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

import ButtonNavbar from "./ButtonNavbar";

function ButtonRecipes({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonNavbar
      // TODO include href
      icon={<PiChefHat size={22} />}
      className={twMerge("", className)}
      {...rest}
    ></ButtonNavbar>
  );
}

export default ButtonRecipes;
