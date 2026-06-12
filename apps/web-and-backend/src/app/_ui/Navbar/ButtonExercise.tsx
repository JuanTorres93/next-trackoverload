import { LiaDumbbellSolid } from "react-icons/lia";
import { twMerge } from "tailwind-merge";

import ButtonNavbar from "./ButtonNavbar";

function ButtonExercise({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonNavbar
      // TODO include href
      icon={<LiaDumbbellSolid size={22} />}
      className={twMerge("", className)}
      {...rest}
    ></ButtonNavbar>
  );
}

export default ButtonExercise;
