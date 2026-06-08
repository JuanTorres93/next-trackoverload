import { twMerge } from "tailwind-merge";

function PopupMenu({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <menu
      className={twMerge(
        "p-2.5 z-20 absolute rounded-xl shadow-lg bg-white flex flex-col gap-2 font-medium text-[14px] min-w-34.25",
        className,
      )}
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
    <li className={twMerge("flex items-center gap-2", className)} {...rest}>
      <span className="">{icon}</span>

      <span>{text}</span>
    </li>
  );
}

export default PopupMenu;
