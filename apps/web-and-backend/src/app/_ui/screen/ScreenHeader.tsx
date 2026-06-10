import { twMerge } from "tailwind-merge";

import ButtonBack from "../buttons/ButtonBack";
import ButtonPlus from "../buttons/ButtonPlus";

function ScreenHeader({
  title,
  hasBackButton = false,
  ...props
}: {
  title: string;
  hasBackButton?: boolean;
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
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.75">
          {hasBackButton && <ButtonBack />}

          <h1 className="font-bold text-[22px]">{title}</h1>
        </div>

        <ButtonPlus />
      </div>

      <div className="absolute -right-10 -top-5 h-50.25 w-50.25 bg-radial from-gradient-app from-30% to-transparent to-80% blur-[224px]"></div>
      <div className="absolute -left-30 -bottom-20 h-50.25 w-50.25 bg-radial from-transparent from-30% to-gradient-app to-80% blur-[224px]"></div>
    </header>
  );
}

export default ScreenHeader;
