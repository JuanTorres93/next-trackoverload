import { twMerge } from "tailwind-merge";

// TODO IMPORTANT: Finish styling when design is done
function Tag({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "inline-flex w-fit items-center text-sm py-1 px-3 border rounded-full",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Tag;
