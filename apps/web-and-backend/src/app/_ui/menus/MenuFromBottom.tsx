"use client";

import { twMerge } from "tailwind-merge";

import { useOutsideClick } from "@/app/_hooks/useOutsideClick";

import SliderMenu from "./SliderMenu";

function MenuFromBottom({
  title,
  show,
  onClose,
  children,
  ...props
}: {
  title: string;
  show?: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const ref = useOutsideClick<HTMLDivElement>(() => {
    onClose?.();
  });

  if (!show) return null;

  return (
    <Backdrop className={twMerge("", className)} {...rest}>
      <SliderMenu title={title} onClose={onClose} ref={ref}>
        {children}
      </SliderMenu>
    </Backdrop>
  );
}

function Backdrop({
  children,
  ...props
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "z-30 fixed inset-0 bg-black/50 backdrop-blur-[2px]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default MenuFromBottom;
