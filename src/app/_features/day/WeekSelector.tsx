'use client';

import { twMerge } from 'tailwind-merge';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { parseFilterValueToDate } from './utils/parseFilterValueToDate';
import ButtonPrimary from '@/app/_ui/buttons/ButtonPrimary';
import { useEffect, useState } from 'react';
import SpinnerMini from '@/app/_ui/SpinnerMini';

function WeekSelector({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const filterKey = 'week';

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [filterToBeApplied, setFilterToBeApplied] = useState<string | null>(
    null,
  );

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

  useEffect(() => {
    if (filterToBeApplied === activeFilter) setIsLoading(false);
  }, [filterToBeApplied, activeFilter]);

  function handleShowPreviousWeek() {
    const previousWeek = subWeeks(currentDate, 1);
    handleFilter(formatDateToFilterValue(previousWeek));
  }

  function handleShowNextWeek() {
    const nextWeek = addWeeks(currentDate, 1);
    handleFilter(formatDateToFilterValue(nextWeek));
  }

  function handleFilter(filterValue: string) {
    setFilterToBeApplied(filterValue);
    setIsLoading(true);

    const params = new URLSearchParams(searchParams);
    params.set(filterKey, filterValue);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className={twMerge(
        `grid grid-cols-[min-content_max-content_max-content] text-lg text-text-minor-emphasis items-center gap-6 max-bp-week-selector:grid-cols-[min-content_minmax(2rem, 20rem)] max-bp-week-selector:gap-3`,
        className,
      )}
      {...rest}
    >
      <div className="flex gap-3">
        <ArrowButton
          direction="left"
          onClick={handleShowPreviousWeek}
          isLoading={isLoading}
        />
        <ArrowButton
          direction="right"
          onClick={handleShowNextWeek}
          isLoading={isLoading}
        />
      </div>

      {!isLoading && (
        <div className="flex gap-3">
          <Day date={weekStart} />
          <span>&mdash;</span>
          <Day date={weekEnd} />
        </div>
      )}

      {isLoading && <SpinnerMini />}

      {!isCurrentWeek && (
        <ButtonPrimary
          className="p-1! px-2! text-sm max-bp-week-selector:col-span-2"
          onClick={() => handleFilter(defaultFilterValue())}
          disabled={isLoading}
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
  isLoading,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  isLoading: boolean;
}) {
  const iconOptions = {
    size: 35,
    strokeWidth: 0.1,
  };

  const style = `text-text-minor-emphasis transition rounded-full p-1 cursor-pointer hover:bg-border/20 ${isLoading ? 'opacity-50 cursor-not-allowed! bg-border/20' : ''}`;

  function handleClick() {
    if (isLoading) return;

    onClick();
  }

  return direction === 'left' ? (
    <HiChevronLeft className={style} {...iconOptions} onClick={handleClick} />
  ) : (
    <HiChevronRight className={style} {...iconOptions} onClick={handleClick} />
  );
}

function Day({ date }: { date: Date }) {
  return (
    <span>
      <span className="max-bp-week-selector:hidden">
        {format(date, "d 'de' MMMM", { locale: es })}
      </span>
      <span className="bp-week-selector:hidden">
        {format(date, 'd MMM', { locale: es })}
      </span>
    </span>
  );
}

function defaultFilterValue() {
  return formatDateToFilterValue(new Date());
}

function formatDateToFilterValue(date: Date) {
  return format(date, 'yyyy_M_d');
}

export default WeekSelector;
