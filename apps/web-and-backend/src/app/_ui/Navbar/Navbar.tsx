import { twMerge } from "tailwind-merge";

import ButtonExercise from "./ButtonExercise";
import ButtonHome from "./ButtonHome";
import ButtonMeals from "./ButtonMeals";
import ButtonRecipes from "./ButtonRecipes";
import ButtonWeight from "./ButtonWeight";

function Navbar({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "p-2.5 bg-secondary-app w-fit rounded-full gap-2.5 flex items-center",
        className,
      )}
      {...rest}
    >
      <ButtonRecipes isActive />
      <ButtonMeals />

      <div></div>
      <ButtonHome />
      <div></div>

      <ButtonExercise />
      <ButtonWeight />
    </div>
  );
}

export default Navbar;
