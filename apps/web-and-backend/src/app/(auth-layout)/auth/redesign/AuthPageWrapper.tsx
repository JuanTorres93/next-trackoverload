import { twMerge } from "tailwind-merge";

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
      <PageWrapper className="h-screen p-0!">
        <SliderMenu
          className="h-[75%] animate-none! pt-7.5"
          title={title}
          showCloseButton={false}
        >
          <span className="-mt-5 text-gray-500">{subtitle}</span>

          {children}
        </SliderMenu>
      </PageWrapper>
    </div>
  );
}

export default AuthPageWrapper;
