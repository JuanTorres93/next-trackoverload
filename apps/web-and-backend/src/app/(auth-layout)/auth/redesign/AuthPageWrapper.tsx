import { twMerge } from "tailwind-merge";

import PageWrapper from "@/app/_ui/PageWrapper";
import SliderMenu from "@/app/_ui/menus/SliderMenu";

function AuthPageWrapper({
  children,
  title,
  ...props
}: {
  children: React.ReactNode;
  title: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <PageWrapper className="h-screen p-0!">
        <SliderMenu className="h-[75%] animate-none!" title={title}>
          {children}
        </SliderMenu>
      </PageWrapper>
    </div>
  );
}

export default AuthPageWrapper;
