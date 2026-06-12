"use client";

import { twMerge } from "tailwind-merge";

import ButtonClose from "../buttons/ButtonClose";
import AppHeader from "../typography/AppHeader";

function SliderMenu({
  title,
  children,
  showCloseButton = true,
  onClose,
  ref,
  ...props
}: {
  title: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <menu
      className={twMerge(
        "absolute text-text bottom-0 flex flex-col gap-5 w-full p-5 bg-white rounded-t-[30px] animate-slide-up",
        className,
      )}
      ref={ref}
      {...rest}
    >
      <header className="flex items-center justify-between">
        <AppHeader className="font-bold">{title}</AppHeader>

        {showCloseButton && <ButtonClose onClick={onClose} />}
      </header>

      {children}
    </menu>
  );
}

export default SliderMenu;
