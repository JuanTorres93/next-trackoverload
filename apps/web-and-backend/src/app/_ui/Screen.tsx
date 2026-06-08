import { twMerge } from "tailwind-merge";

import ScreenHeader from "./Header";
import PageWrapper from "./PageWrapper";

function Screen({
  title,
  hasBackButton = false,
  children,
  ...props
}: {
  title: string;
  hasBackButton?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <PageWrapper
      className={twMerge(
        "relative max-w-5xl gap-6.25 grid grid-cols-1 grid-rows-[max-content_1fr]",
        className,
      )}
      {...rest}
    >
      <ScreenHeader title={title} hasBackButton={hasBackButton} />

      <div className="px-5 overflow-y-scroll">{children}</div>
    </PageWrapper>
  );
}

export default Screen;
