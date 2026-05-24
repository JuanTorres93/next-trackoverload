import { twMerge } from "tailwind-merge";

function ErrorBox({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "p-4 mb-4 text-sm text-error bg-error/15 rounded-lg",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default ErrorBox;
