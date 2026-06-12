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
        "flex flex-col items-center justify-end pb-5 relative",
        className,
      )}
      {...rest}
    >
      <NavbarMenu className="z-10" />
      <NavbarBackdrop className="z-5" />
    </div>
  );
}

function NavbarMenu({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "p-2.5 bg-secondary-app w-fit rounded-full gap-2.5 flex items-center",
        className,
      )}
      {...rest}
    >
      <ButtonRecipes />
      <ButtonMeals />

      <div></div>
      <ButtonHome />
      <div></div>

      <ButtonExercise />
      <ButtonWeight />
    </div>
  );
}

function NavbarBackdrop({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "absolute bottom-0 left-0 h-36.5! w-full  bg-linear-to-t from-background-app from-13% to-transparent backdrop-blur-2xl mask-[linear-gradient(to_top,black_0%,black_13%,transparent)] pointer-events-none",
        className,
      )}
      {...rest}
    />
  );
}

export default Navbar;
