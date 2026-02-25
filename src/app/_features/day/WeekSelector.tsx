import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

function WeekSelector({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={`flex text-lg text-text-minor-emphasis items-center gap-6 ${className}`}
      {...rest}
    >
      <div className="flex gap-3">
        <ArrowButton direction="left" />
        <ArrowButton direction="right" />
      </div>

      <div className="flex gap-3">
        <Day date={new Date(2024, 0, 1)} />
        <span>&mdash;</span>
        <Day date={new Date(2024, 0, 7)} />
      </div>
    </div>
  );
}

function ArrowButton({ direction }: { direction: 'left' | 'right' }) {
  const iconOptions = {
    size: 35,
    strokeWidth: 0.1,
  };

  const style =
    'text-text-minor-emphasis transition  rounded-full p-1 cursor-pointer hover:bg-border/20';

  return direction === 'left' ? (
    <div className="bg-sur">
      <HiChevronLeft className={style} {...iconOptions} />
    </div>
  ) : (
    <HiChevronRight className={style} {...iconOptions} />
  );
}

function Day({ date }: { date: Date }) {
  const dayNumber = format(date, 'd');
  // TODO: Change if we want to support multiple languages
  const monthName = format(date, 'MMMM', { locale: es });

  return (
    <span>
      {dayNumber} de {monthName}
    </span>
  );
}

export default WeekSelector;
