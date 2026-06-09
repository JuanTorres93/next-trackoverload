import { twMerge } from "tailwind-merge";

function MealSelectionList({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLUListElement>) {
  const { className, ...rest } = props;

  return (
    <ul
      className={twMerge(
        "flex flex-col items-stretch gap-3 overflow-y-scroll",
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  );
}

export default MealSelectionList;
