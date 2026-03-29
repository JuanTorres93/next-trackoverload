'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { parseFilterValueToDate } from './utils/parseFilterValueToDate';
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

  const weekStartsOnMonday = 1;
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

  function handleFilter(filterValue: string) {
    setFilterToBeApplied(filterValue);
    setIsLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set(filterKey, filterValue);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const handlePrev = () =>
    handleFilter(formatDateToFilterValue(subWeeks(currentDate, 1)));
  const handleNext = () =>
    handleFilter(formatDateToFilterValue(addWeeks(currentDate, 1)));

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`} {...rest}>
      {/* Arrow buttons grouped together on the left */}
      <div className="flex items-center border border-border/60 rounded-lg overflow-hidden shrink-0">
        <NavButton direction="left" onClick={handlePrev} disabled={isLoading} />
        <div className="w-px h-5 bg-border/60" />
        <NavButton
          direction="right"
          onClick={handleNext}
          disabled={isLoading}
        />
      </div>

      {/* Date range */}
      <div className="flex items-center gap-1.5 min-w-0">
        {isLoading ? (
          <SpinnerMini />
        ) : (
          <span className="font-semibold text-text whitespace-nowrap">
            <span className="max-bp-week-selector:hidden">
              {format(weekStart, "d 'de' MMMM", { locale: es })}
              {' — '}
              {format(weekEnd, "d 'de' MMMM", { locale: es })}
            </span>
            <span className="bp-week-selector:hidden">
              {format(weekStart, 'd MMM', { locale: es })}
              {' — '}
              {format(weekEnd, 'd MMM', { locale: es })}
            </span>
          </span>
        )}

        {!isCurrentWeek && !isLoading && (
          <button
            onClick={() => handleFilter(defaultFilterValue())}
            disabled={isLoading}
            className="text-xs font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full px-2 py-0.5 hover:bg-primary hover:text-white transition shrink-0 cursor-pointer"
          >
            Hoy
          </button>
        )}
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === 'left' ? HiChevronLeft : HiChevronRight;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`flex items-center justify-center w-8 h-8 transition text-text-minor-emphasis hover:bg-surface-light hover:text-text ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Icon size={18} />
    </button>
  );
}

function defaultFilterValue() {
  return formatDateToFilterValue(new Date());
}

function formatDateToFilterValue(date: Date) {
  return format(date, 'yyyy_M_d');
}

export default WeekSelector;
