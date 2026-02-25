'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { parseFilterValueToDate } from './utils/parseFilterValueToDate';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';

function WeekSelector({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const filterKey = 'week';

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams?.get(filterKey) || defaultFilterValue();
  const currentDate = parseFilterValueToDate(activeFilter);

  const weekStartsOnMonday = 1; // 1 for Monday
  const weekStart = startOfWeek(currentDate, {
    weekStartsOn: weekStartsOnMonday,
  });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: weekStartsOnMonday });

  const isCurrentWeek =
    format(weekStart, 'yyyy_M_d') ===
    format(
      startOfWeek(new Date(), { weekStartsOn: weekStartsOnMonday }),
      'yyyy_M_d',
    );

  function handleShowPreviousWeek() {
    const previousWeek = subWeeks(currentDate, 1);
    handleFilter(formatDateToFilterValue(previousWeek));
  }

  function handleShowNextWeek() {
    const nextWeek = addWeeks(currentDate, 1);
    handleFilter(formatDateToFilterValue(nextWeek));
  }

  function handleFilter(filterValue: string) {
    const params = new URLSearchParams(searchParams);
    params.set(filterKey, filterValue);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className={`flex text-lg text-text-minor-emphasis items-center gap-6 ${className}`}
      {...rest}
    >
      <div className="flex gap-3">
        <ArrowButton direction="left" onClick={handleShowPreviousWeek} />
        <ArrowButton direction="right" onClick={handleShowNextWeek} />
      </div>

      <div className="flex gap-3">
        <Day date={weekStart} />
        <span>&mdash;</span>
        <Day date={weekEnd} />
      </div>

      {!isCurrentWeek && (
        <ButtonPrimary
          className="p-1! px-2! text-sm"
          onClick={() => handleFilter(defaultFilterValue())}
        >
          Ir a semana actual
        </ButtonPrimary>
      )}
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const iconOptions = {
    size: 35,
    strokeWidth: 0.1,
  };

  const style =
    'text-text-minor-emphasis transition rounded-full p-1 cursor-pointer hover:bg-border/20';

  return direction === 'left' ? (
    <HiChevronLeft className={style} {...iconOptions} onClick={onClick} />
  ) : (
    <HiChevronRight className={style} {...iconOptions} onClick={onClick} />
  );
}

function Day({ date }: { date: Date }) {
  return <span>{format(date, "d 'de' MMMM", { locale: es })}</span>;
}

function defaultFilterValue() {
  return formatDateToFilterValue(new Date());
}

function formatDateToFilterValue(date: Date) {
  return format(date, 'yyyy_M_d');
}

export default WeekSelector;
