import { twMerge } from "tailwind-merge";

function TextLink({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <span
      className={twMerge(
        "font-semibold text-[13px] text-secondary-app cursor-pointer hover:text-secondary-light-app",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export default TextLink;
