import { twMerge } from "tailwind-merge";

import Logo from "@/app/_ui/Logo";
import PageWrapper from "@/app/_ui/PageWrapper";
import SliderMenu from "@/app/_ui/menus/SliderMenu";

function AuthPageWrapper({
  children,
  title,
  subtitle,
  ...props
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <PageWrapper className="relative h-screen p-0!">
        <CimientosHeader className="absolute top-8 left-0 z-10 h-[25%]" />

        <SliderMenu
          className="h-[75%] animate-none! z-10 pt-7.5 [&_h2]:text-[24px] bg-background-app"
          title={title}
          showCloseButton={false}
        >
          <span className="-mt-5 text-gray-500">{subtitle}</span>

          {children}
        </SliderMenu>

        <Gradient className="h-[55%]! -top-65" />
      </PageWrapper>
    </div>
  );
}

function CimientosHeader({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <header
      className={twMerge(
        "flex flex-col items-center justify-center gap-2 w-full",
        className,
      )}
      {...rest}
    >
      <h1 className="text-[26px] font-bold flex items-center gap-3">
        <div className="p-2 bg-white rounded-[10px]">
          <Logo size={38} />
        </div>
        Cimientos
      </h1>

      <h2 className="font-medium text-[14px]">
        Construye consistencia. Un día cada vez.
      </h2>
    </header>
  );
}

function Gradient({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "absolute z-0 top-0 left-0 h-60 w-full -rotate-128 bg-radial from-white/65 from-6% to-transparent to-70% backdrop-blur-[180px] ",
        className,
      )}
      {...rest}
    />
  );
}

export default AuthPageWrapper;
