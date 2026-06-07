import { twMerge } from "tailwind-merge";

import ButtonClose from "../buttons/ButtonClose";

function SliderMenu({
  title,
  children,
  showCloseButton = true,
  ...props
}: {
  title: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "absolute bottom-0 flex flex-col gap-5 w-full p-5 bg-white rounded-t-[30px] animate-slide-up",
        className,
      )}
      {...rest}
    >
      <header className="flex items-center justify-between">
        <h2 className="font-bold text-[20px]">{title}</h2>

        {showCloseButton && <ButtonClose />}
      </header>
      {children}
    </div>
  );
}

export default SliderMenu;
