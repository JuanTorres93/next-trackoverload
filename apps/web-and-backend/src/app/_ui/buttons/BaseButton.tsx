import { twMerge } from "tailwind-merge";

function BaseButton({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <button
      className={twMerge(
        "font-semibold py-2.5 border border-secondary-app rounded-full text-[16px] hover:cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default BaseButton;
