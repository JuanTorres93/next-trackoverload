import { twMerge } from "tailwind-merge";

function ScreenHeader({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <header
      className={twMerge(
        "relative h-33 w-full rounded-[26px] p-5 flex flex-col justify-end overflow-hidden",
        className,
      )}
      {...rest}
    >
      <div className="relative z-10">{children}</div>

      <div className="z-0 absolute -right-10 -top-5 h-50.25 w-50.25 bg-radial from-gradient-app from-30% to-transparent to-80% blur-[224px]"></div>
      <div className="z-0 absolute -left-30 -bottom-20 h-50.25 w-50.25 bg-radial from-transparent from-30% to-gradient-app to-80% blur-[224px]"></div>
    </header>
  );
}

export default ScreenHeader;
