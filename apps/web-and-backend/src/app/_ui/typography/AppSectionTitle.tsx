import { twMerge } from "tailwind-merge";

function AppSectionTitle({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <h2
      className={twMerge("font-semibold text-[16px] pb-3.75", className)}
      {...rest}
    >
      {children}
    </h2>
  );
}

export default AppSectionTitle;
