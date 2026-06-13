import { twMerge } from "tailwind-merge";

import ButtonBack from "../buttons/ButtonBack";
import HeaderContainer from "./HeaderContainer";

function ScreenHeader({
  title,
  hasBackButton = false,
  screenMenuOpener,
  ...props
}: {
  title: string;
  hasBackButton?: boolean;
  screenMenuOpener?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <HeaderContainer className={twMerge("", className)} {...rest}>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.75">
          {hasBackButton && <ButtonBack />}

          <h1 className="font-bold text-[22px]">{title}</h1>
        </div>

        {screenMenuOpener && screenMenuOpener}
      </div>

      <div className="absolute -right-10 -top-5 h-50.25 w-50.25 bg-radial from-gradient-app from-30% to-transparent to-80% blur-[224px]"></div>
      <div className="absolute -left-30 -bottom-20 h-50.25 w-50.25 bg-radial from-transparent from-30% to-gradient-app to-80% blur-[224px]"></div>
    </HeaderContainer>
  );
}

export default ScreenHeader;
