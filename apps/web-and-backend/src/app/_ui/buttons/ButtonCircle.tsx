import { twMerge } from "tailwind-merge";

function ButtonCircle({
  children,
  popupVariant = false,
  ...props
}: {
  children?: React.ReactNode;
  popupVariant?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <button
      className={twMerge(
        `rounded-full hover:cursor-pointer transition ${popupVariant ? "bg-background-app p-1.5" : "p-2.5 bg-white"}`,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ButtonCircle;
