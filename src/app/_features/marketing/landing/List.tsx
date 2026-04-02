import { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

interface ListProps {
  items: string[];
  icon?: ReactNode;
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
}

export default function List({
  items,
  icon,
  className = "",
  itemClassName = "",
  iconClassName = "",
}: ListProps) {
  // Icono por defecto si no se proporciona uno
  const defaultIcon = (
    <span
      className={twMerge(
        `w-1.5 h-1.5 bg-primary/60 rounded-full`,
        iconClassName,
      )}
    />
  );

  return (
    <ul className={twMerge(`space-y-3`, className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className={twMerge(`flex items-start gap-3`, itemClassName)}
        >
          <span className="flex items-center h-6">
            {icon ? icon : defaultIcon}
          </span>
          <span className="flex-1 leading-6 text-text-minor-emphasis">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
