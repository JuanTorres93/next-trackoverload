import { SiMealie } from "react-icons/si";
import { twMerge } from "tailwind-merge";

import ButtonNavbar from "./ButtonNavbar";

function ButtonMeals({
  isActive = false,
  ...props
}: { isActive?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonNavbar
      icon={<SiMealie size={22} />}
      isActive={isActive}
      className={twMerge("", className)}
      {...rest}
    ></ButtonNavbar>
  );
}

export default ButtonMeals;
