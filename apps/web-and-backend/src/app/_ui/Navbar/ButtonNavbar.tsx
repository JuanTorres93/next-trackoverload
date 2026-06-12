"use client";

import { usePathname } from "next/navigation";

import { twMerge } from "tailwind-merge";

import ButtonCircle from "../buttons/ButtonCircle";

function ButtonNavbar({
  icon,
  href,
  ...props
}: {
  icon: React.ReactNode;
  href?: string;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <ButtonCircle
      href={href}
      className={twMerge(
        "p-4.25 bg-secondary-light-app text-white hover:bg-secondary-light-app/80",
        isActive &&
          "bg-active-navbar text-secondary-app hover:bg-active-navbar",
        className,
      )}
      {...rest}
    >
      {icon}
    </ButtonCircle>
  );
}

export default ButtonNavbar;
