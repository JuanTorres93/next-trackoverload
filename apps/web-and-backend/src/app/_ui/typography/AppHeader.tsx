import { twMerge } from "tailwind-merge";

function AppHeader({
  as: Component = "h2",
  children,
  ...props
}: {
  as?: React.ElementType;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <Component
      className={twMerge("text-[20px] font-semibold", className)}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default AppHeader;
