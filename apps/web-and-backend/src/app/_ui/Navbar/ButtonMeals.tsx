import { SiMealie } from "react-icons/si";
import { twMerge } from "tailwind-merge";

import ButtonNavbar from "./ButtonNavbar";

function ButtonMeals({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonNavbar
      // TODO include href
      icon={<SiMealie size={22} />}
      className={twMerge("", className)}
      {...rest}
    ></ButtonNavbar>
  );
}

export default ButtonMeals;
