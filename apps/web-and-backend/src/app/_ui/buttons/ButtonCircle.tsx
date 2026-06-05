import { twMerge } from "tailwind-merge";

function ButtonCircle({
  children,
  ...props
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <button
      className={twMerge("p-2.5 bg-white rounded-full", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ButtonCircle;
