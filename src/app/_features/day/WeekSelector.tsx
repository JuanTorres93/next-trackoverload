"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

import SpinnerMini from "@/app/_ui/SpinnerMini";

import { parseFilterValueToDate } from "./utils/parseFilterValueToDate";

function WeekSelector({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const filterKey = "week";

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  const [filterToBeApplied, setFilterToBeApplied] = useState<string | null>(
    null,
  );
  const activeFilter = searchParams?.get(filterKey) || setFilterToToday();

  const dateAccordingFilter: Date = parseFilterValueToDate(activeFilter);

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

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`} {...rest}>
      <ArrowButtons
        isLoading={isLoading}
        handleFilter={handleFilter}
        dateAccordingFilter={dateAccordingFilter}
      />

      <DateRangeDisplay
        isLoading={isLoading}
        dateAccordingFilter={dateAccordingFilter}
        handleFilter={handleFilter}
      />
    </div>
  );
}

function ArrowButtons({
  isLoading,
  handleFilter,
  dateAccordingFilter,
  ...props
}: {
  isLoading: boolean;
  handleFilter: (filterValue: string) => void;
  dateAccordingFilter: Date;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const handlePrev = () =>
    handleFilter(formatDateToFilterValue(subWeeks(dateAccordingFilter, 1)));

  const handleNext = () =>
    handleFilter(formatDateToFilterValue(addWeeks(dateAccordingFilter, 1)));

  return (
    <div
      className={twMerge(
        "flex items-center overflow-hidden border rounded-lg border-border/60 shrink-0",
        className,
      )}
      {...rest}
    >
      <NavButton
        data-testid="prev-week-button"
        direction="left"
        onClick={handlePrev}
        disabled={isLoading}
      />

      <div className="w-px h-5 bg-border/60" />

      <NavButton
        data-testid="next-week-button"
        direction="right"
        onClick={handleNext}
        disabled={isLoading}
      />
    </div>
  );
}

function DateRangeDisplay({
  isLoading,
  dateAccordingFilter,
  handleFilter,
}: {
  isLoading: boolean;
  dateAccordingFilter: Date;
  handleFilter: (filterValue: string) => void;
}) {
  const weekStartsOnMonday = 1;
  const weekStart = startOfWeek(dateAccordingFilter, {
    weekStartsOn: weekStartsOnMonday,
  });
  const weekEnd = endOfWeek(dateAccordingFilter, {
    weekStartsOn: weekStartsOnMonday,
  });

  const isCurrentWeek =
    format(weekStart, "yyyy_M_d") ===
    format(
      startOfWeek(new Date(), { weekStartsOn: weekStartsOnMonday }),
      "yyyy_M_d",
    );

  return (
    <div
      data-testid="week-range-display"
      className="flex items-center gap-1.5 min-w-0"
    >
      {isLoading ? (
        <SpinnerMini />
      ) : (
        <span className="font-semibold text-text whitespace-nowrap">
          {/* Desktop view */}
          <span className="max-bp-week-selector:hidden">
            {format(weekStart, "d 'de' MMMM", { locale: es })}
            {" — "}
            {format(weekEnd, "d 'de' MMMM", { locale: es })}
          </span>

          {/* Mobile view */}
          <span className="bp-week-selector:hidden">
            {format(weekStart, "d MMM", { locale: es })}
            {" — "}
            {format(weekEnd, "d MMM", { locale: es })}
          </span>
        </span>
      )}

      {!isCurrentWeek && !isLoading && (
        <button
          onClick={() => handleFilter(setFilterToToday())}
          disabled={isLoading}
          className="text-xs font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full px-2 py-0.5 hover:bg-primary hover:text-white transition shrink-0 cursor-pointer"
        >
          Hoy
        </button>
      )}
    </div>
  );
}

function NavButton({
  direction,
  onClick,
  disabled,
  ...props
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const Icon = direction === "left" ? HiChevronLeft : HiChevronRight;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`flex items-center justify-center w-8 h-8 transition text-text-minor-emphasis hover:bg-surface-light hover:text-text ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      {...props}
    >
      <Icon size={18} />
    </button>
  );
}

function setFilterToToday() {
  return formatDateToFilterValue(new Date());
}

export function formatDateToFilterValue(date: Date) {
  return format(date, "yyyy_M_d");
}

export default WeekSelector;
