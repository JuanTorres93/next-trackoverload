import { IconType } from 'react-icons';
import {
  FaHeart,
  FaBrain,
  FaDumbbell,
  FaUsers,
  FaUtensils,
  FaCheckCircle,
} from 'react-icons/fa';

interface FeatureListProps {
  items: string[];
  variant?: 'default' | 'check' | 'pill';
  columns?: 1 | 2;
  className?: string;
}

const icons: Record<string, IconType> = {
  'Salud física': FaDumbbell,
  Nutrición: FaUtensils,
  'Salud mental': FaBrain,
  Amistad: FaUsers,
  Amor: FaHeart,
};

export default function FeatureList({
  items,
  variant = 'default',
  columns = 1,
  className = '',
}: FeatureListProps) {
  const getIcon = (item: string) => {
    const key = Object.keys(icons).find((k) => item.includes(k));
    return key ? icons[key] : null;
  };

  if (variant === 'pill') {
    return (
      <div className={`flex flex-wrap gap-3 justify-center ${className}`}>
        {items.map((item, index) => {
          const Icon = getIcon(item);
          return (
            <div
              key={index}
              className="flex items-center gap-2 px-6 py-3 transition-all duration-300 bg-white border border-gray-100 rounded-full shadow-sm group hover:shadow-md hover:border-primary/20"
            >
              {Icon && <Icon className="w-5 h-5 text-primary" />}
              <span className="text-text">{item}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ul
      className={`grid grid-cols-1 md:grid-cols-${columns} gap-4 ${className}`}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 group">
          <span className="flex items-center justify-center w-6 h-6 mt-0.5">
            {variant === 'check' ? (
              <FaCheckCircle className="w-5 h-5 transition-transform text-primary group-hover:scale-110" />
            ) : (
              <span className="w-2 h-2 transition-transform rounded-full bg-primary group-hover:scale-125" />
            )}
          </span>
          <span className="flex-1 transition-colors text-text-minor-emphasis group-hover:text-text">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
