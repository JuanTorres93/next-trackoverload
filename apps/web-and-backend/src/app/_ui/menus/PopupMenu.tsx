import { twMerge } from "tailwind-merge";

function PopupMenu({
  children,
  ref,
  ...props
}: {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <menu
      className={twMerge(
        "p-2.5 z-20 absolute rounded-xl shadow-lg bg-white flex flex-col gap-2 font-medium text-[14px] min-w-34.25",
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </menu>
  );
}

export function PopupMenuItem({
  icon,
  text,
  ...props
}: {
  icon: React.ReactNode;
  text: string;
} & React.HTMLAttributes<HTMLLIElement>) {
  const { className, ...rest } = props;

  return (
    <li
      className={twMerge(
        "flex items-center rounded-sm gap-2 transition cursor-pointer hover:bg-background-dark-app/30",
        className,
      )}
      {...rest}
    >
      <span className="">{icon}</span>

      <span>{text}</span>
    </li>
  );
}

export default PopupMenu;
