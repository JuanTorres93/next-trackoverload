import { twMerge } from "tailwind-merge";

import SliderMenu from "./SliderMenu";

function MenuFromBottom({
  title,
  show,
  children,
  ...props
}: {
  title: string;
  show?: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  if (!show) return null;

  return (
    <Backdrop className={twMerge("", className)} {...rest}>
      <SliderMenu title={title}>{children}</SliderMenu>
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
