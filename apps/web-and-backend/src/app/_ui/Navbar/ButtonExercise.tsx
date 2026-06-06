import { LiaDumbbellSolid } from "react-icons/lia";
import { twMerge } from "tailwind-merge";

import ButtonNavbar from "./ButtonNavbar";

function ButtonExercise({
  isActive = false,
  ...props
}: { isActive?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonNavbar
      icon={<LiaDumbbellSolid size={22} />}
      isActive={isActive}
      className={twMerge("", className)}
      {...rest}
    ></ButtonNavbar>
  );
}

export default ButtonExercise;
