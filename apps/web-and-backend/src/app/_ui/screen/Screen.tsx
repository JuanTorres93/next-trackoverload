import { twMerge } from "tailwind-merge";

import PageWrapper from "../PageWrapper";
import ScreenHeader from "../screen/ScreenHeader";
import DashboardHeader from "./DashboardHeader";

function Screen({
  title,
  hasBackButton = false,
  isDashboard = false,
  screenMenuOpener,
  children,
  ...props
}: {
  title: string;
  hasBackButton?: boolean;
  isDashboard?: boolean;
  screenMenuOpener?: React.ReactNode;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <PageWrapper
      className={twMerge(
        "relative max-w-5xl gap-6.25 grid grid-cols-1 grid-rows-[max-content_1fr]  overflow-y-scroll",
        className,
      )}
      {...rest}
    >
      {!isDashboard && (
        <ScreenHeader
          title={title}
          hasBackButton={hasBackButton}
          screenMenuOpener={screenMenuOpener}
        />
      )}
      {isDashboard && <DashboardHeader />}

      <div className="px-5">{children}</div>
    </PageWrapper>
  );
}

export default Screen;
