import { twMerge } from "tailwind-merge";

function AppSubsectionTitle({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <h3
      className={twMerge(
        "font-semibold text-[14px] pb-2.5 text-text-minor-emphasis-app",
        className,
      )}
      {...rest}
    >
      {children}
    </h3>
  );
}

export default AppSubsectionTitle;
