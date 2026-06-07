import { twMerge } from "tailwind-merge";

function FoodGrid({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "grid grid-cols-[repeat(2,min-content)] gap-x-4.25 gap-y-5.5",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default FoodGrid;
