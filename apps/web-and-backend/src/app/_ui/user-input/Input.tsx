import { twMerge } from "tailwind-merge";

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <input
      className={twMerge(
        "rounded-full font-medium text-[14px] bg-white py-3 px-3.75 placeholder:text-text-minor-emphasis-app focus:outline-none focus:ring-0 border border-text-minor-emphasis-app/20 shadow-xs",
        className,
      )}
      {...rest}
    />
  );
}

export default Input;
