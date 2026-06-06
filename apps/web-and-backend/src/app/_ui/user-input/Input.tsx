import { twMerge } from "tailwind-merge";

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <input
      className={twMerge(
        "rounded-full font-medium bg-white py-3 px-3.75 placeholder:text-text-minor-emphasis-app ring-text-minor-emphasis-app focus:outline-none focus:ring-2 focus:ring-text-minor-emphasis-app",
        className,
      )}
      {...rest}
    />
  );
}

export default Input;
