import { LuWeight } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import ButtonNavbar from "./ButtonNavbar";

function ButtonWeight({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonNavbar
      href="/app/weight"
      icon={<LuWeight size={22} />}
      className={twMerge("", className)}
      {...rest}
    ></ButtonNavbar>
  );
}

export default ButtonWeight;
