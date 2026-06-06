import { twMerge } from "tailwind-merge";

import ButtonCircle from "../buttons/ButtonCircle";

function ButtonNavbar({
  icon,
  isActive = false,
  ...props
}: {
  icon: React.ReactNode;
  isActive?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <ButtonCircle
      className={twMerge(
        "p-4.25 bg-secondary-light-app text-white",
        isActive && "bg-active-navbar text-secondary-app",
        className,
      )}
      {...rest}
    >
      {icon}
    </ButtonCircle>
  );
}

export default ButtonNavbar;
