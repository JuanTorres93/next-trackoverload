import { TbSmartHome } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "../buttons/ButtonCircle";

function ButtonHome({ ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonCircle
      className={twMerge("p-4.25 bg-primary-app", className)}
      {...rest}
    >
      <TbSmartHome size={22} />
    </ButtonCircle>
  );
}

export default ButtonHome;
