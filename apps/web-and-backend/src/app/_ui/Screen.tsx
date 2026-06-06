import { twMerge } from "tailwind-merge";

import Header from "./Header";
import PageWrapper from "./PageWrapper";

function Screen({
  title,
  children,
  ...props
}: {
  title: string;
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
      <Header title={title} />

      <div className="px-5 overflow-y-scroll">{children}</div>
    </PageWrapper>
  );
}

export default Screen;
