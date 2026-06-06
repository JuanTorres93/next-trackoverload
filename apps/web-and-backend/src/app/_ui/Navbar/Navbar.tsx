import { twMerge } from "tailwind-merge";

import ButtonExercise from "./ButtonExercise";
import ButtonHome from "./ButtonHome";
import ButtonMeals from "./ButtonMeals";
import ButtonRecipes from "./ButtonRecipes";
import ButtonWeight from "./ButtonWeight";

function Navbar({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <ButtonRecipes isActive />
      <ButtonMeals />

      <ButtonHome />

      <ButtonExercise />
      <ButtonWeight />
    </div>
  );
}

export default Navbar;
