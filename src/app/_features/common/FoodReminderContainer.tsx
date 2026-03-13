'use client';
import { twMerge } from 'tailwind-merge';

import { HiArrowPath } from 'react-icons/hi2';

function FoodReminderContainer({
  children,
  isEaten,
  ...props
}: { isEaten?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  async function handleReplace(e: React.MouseEvent<HTMLSpanElement>) {
    e.stopPropagation();
  }

  return (
    <div
      {...rest}
      className={twMerge(
        `bg-surface-card relative grid grid-cols-[1fr_min-content] gap-4 grid-rows-1! shadow-sm p-2 rounded-xl overflow-hidden hover:scale-102 cursor-pointer transition ${isEaten && 'bg-primary! text-text-light shadow-xs! scale-97!'}`,
        className,
      )}
    >
      {children}

      <span
        onClick={(e) => handleReplace(e)}
        className={twMerge(
          'flex items-center gap-1 text-xs opacity-60 hover:text-primary transition-colors',
          isEaten && 'hover:opacity-80 hover:text-text-light',
        )}
      >
        <HiArrowPath className="w-6 h-6" />
      </span>
    </div>
  );
}

export default FoodReminderContainer;
