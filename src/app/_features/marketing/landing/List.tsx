// app/_features/marketing/landing/List.tsx
import { ReactNode } from 'react';

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
  className = '',
  itemClassName = '',
  iconClassName = '',
}: ListProps) {
  // Icono por defecto si no se proporciona uno
  const defaultIcon = (
    <span className={`w-1.5 h-1.5 bg-text rounded-full ${iconClassName}`} />
  );

  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className={`flex items-start gap-3 ${itemClassName}`}>
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
