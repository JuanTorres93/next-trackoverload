import { twMerge } from "tailwind-merge";

function ButtonCircle({
  children,
  popupVariant = false,
  ...props
}: {
  children?: React.ReactNode;
  popupVariant?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <button
      className={twMerge(
        `rounded-full ${popupVariant ? "bg-background-app p-1.5" : "p-2.5 bg-white"}`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ButtonCircle;
