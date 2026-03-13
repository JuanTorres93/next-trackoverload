import { twMerge } from 'tailwind-merge';

function FoodReminderContainer({
  children,
  isEaten,
  ...props
}: { isEaten?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      {...rest}
      className={twMerge(
        `bg-surface-card shadow-sm p-2 rounded-xl overflow-hidden gap-4 hover:scale-102 cursor-pointer transition ${isEaten && 'bg-primary! text-text-light shadow-xs! scale-97!'}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

export default FoodReminderContainer;
