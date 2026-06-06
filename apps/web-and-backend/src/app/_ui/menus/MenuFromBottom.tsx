import { twMerge } from "tailwind-merge";

import ButtonClose from "../buttons/ButtonClose";

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
      <Menu title={title}>{children}</Menu>
    </Backdrop>
  );
}

function Menu({
  title,
  children,
  ...props
}: {
  title: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="absolute bottom-0 flex flex-col gap-5 w-full p-5 bg-white rounded-t-[30px] animate-slide-up"
      {...props}
    >
      <header className="flex items-center justify-between">
        <h2 className="font-bold text-[20px]">{title}</h2>

        <ButtonClose />
      </header>
      {children}
    </div>
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
        "z-20 absolute inset-0 bg-black/50 backdrop-blur-[2px]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default MenuFromBottom;
