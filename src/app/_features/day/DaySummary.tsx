"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HiLightningBolt } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";

import Modal from "@/app/_ui/Modal";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";
import { AssembledDayDTO } from "@/application-layer/dtos/AssembledDayDTO";
import { dayIdToDayMonthYear } from "@/domain/value-objects/DayId/DayId";

import AddFakeMealModal from "../fakemeal/AddFakeMealModal";
import FakeMeal from "../fakemeal/FakeMeal";
import MealLine from "../meal/MealLine";
import SelectRecipeModal from "../recipe/SelectRecipeModal";
import { addMealsToDay } from "./actions";

function DaySummary({
  dayId,
  assembledDay,
  onSelectDay,
  isSelected,
}: {
  dayId: string;
  assembledDay?: AssembledDayDTO | null;
  onSelectDay?: (dayId: string) => void;
  isSelected?: boolean;
}) {
  const { isToday, isPast } = getAssembledDayInfo(assembledDay);

  async function addMealsRequest(recipesIds: string[]) {
    await addMealsToDay(dayId, recipesIds);
  }

  return (
    <Modal>
      <article
        id={dayId}
        className={`flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden
          ${isToday ? "border-primary shadow-[0_0_0_2px_var(--color-primary-light)]" : "border-border/60"}
          ${isSelected ? "border-selected! shadow-[0_0_0_2px_var(--color-selected)]!" : ""}
          ${isPast && !isToday ? "opacity-55" : ""}
          bg-surface-card
        `}
      >
        <DayHeader
          dayId={dayId}
          assembledDay={assembledDay}
          isSelected={Boolean(isSelected)}
          onSelectDay={onSelectDay}
        />

        <MealsList assembledDay={assembledDay} dayId={dayId} />

        {/* Action buttons  */}
        <div className="flex mt-auto border-t border-border/30">
          <Modal.Open opens="add-food-modal">
            <ActionButton
              icon={<HiPlus size={13} />}
              label="Comida"
              className="border-r border-border/30"
            />
          </Modal.Open>

          <Modal.Open opens="add-fake-meal-modal">
            <ActionButton icon={<HiLightningBolt size={12} />} label="Rápido" />
          </Modal.Open>
        </div>
      </article>

      <Modal.Window name="add-food-modal" className="p-0 overflow-hidden">
        <SelectRecipeModal addMealsRequest={addMealsRequest} />
      </Modal.Window>

      <Modal.Window name="add-fake-meal-modal">
        <AddFakeMealModal dayId={dayId} />
      </Modal.Window>
    </Modal>
  );
}

function DayHeader({
  dayId,
  assembledDay,
  isSelected,
  onSelectDay,
}: {
  dayId: string;
  assembledDay?: AssembledDayDTO | null;
  isSelected: boolean;
  onSelectDay?: (dayId: string) => void;
}) {
  const { hasMeals, dayTotalCalories, dayTotalProtein, isToday } =
    getAssembledDayInfo(assembledDay);

  const { day, month, year } = dayIdToDayMonthYear(dayId);
  const date = new Date(year, month - 1, day);
  const dayName =
    format(date, "EEEE", { locale: es }).charAt(0).toUpperCase() +
    format(date, "EEEE", { locale: es }).slice(1);
  const dateLabel = format(date, "d MMM", { locale: es });

  return (
    <header
      onClick={() => onSelectDay?.(dayId)}
      className={`flex flex-col px-4 py-3 cursor-pointer transition-colors select-none border-b border-border/30
            ${isToday ? "bg-surface-hover" : "bg-surface-light"}
            ${isSelected ? "bg-selected/10!" : ""}
            hover:bg-surface-hover
          `}
    >
      {/* Row 1: day name + selection badge */}
      <div className="flex items-center gap-1.5">
        <span
          className={`font-semibold leading-tight ${isToday ? "text-primary" : "text-text"}`}
        >
          {dayName}
        </span>

        {isToday && (
          <span className="text-[10px] font-semibold text-primary bg-primary/15 rounded-full px-1.5 py-0.5 leading-none shrink-0">
            Hoy
          </span>
        )}

        {isSelected && !isToday && (
          <span className="text-[10px] font-semibold text-selected bg-selected/10 rounded-full px-1.5 py-0.5 leading-none shrink-0">
            ✓
          </span>
        )}
      </div>

      {/* Row 2: date + totals on the same compact line */}
      <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
        <span className="text-xs text-text-minor-emphasis">{dateLabel}</span>
        {hasMeals && (
          <>
            <span className="text-xs text-border">&mdash;</span>

            <span className="text-xs font-medium text-text">
              {formatToInteger(dayTotalCalories)} kcal
            </span>

            <span className="text-xs text-text-minor-emphasis">
              · {formatToInteger(dayTotalProtein)} g
            </span>
          </>
        )}
      </div>
    </header>
  );
}

function MealsList({
  assembledDay,
  dayId,
}: {
  assembledDay?: AssembledDayDTO | null;
  dayId: string;
}) {
  const { meals, fakeMeals, hasMeals } = getAssembledDayInfo(assembledDay);

  return (
    <div className="flex flex-col flex-1 overflow-y-auto divide-y max-h-64 divide-border/20">
      {meals.map((meal) => (
        <MealLine key={meal.id} meal={meal} dayId={dayId} />
      ))}
      {fakeMeals.map((fakeMeal) => (
        <FakeMeal key={fakeMeal.id} fakeMeal={fakeMeal} dayId={dayId} />
      ))}

      {!hasMeals && (
        <div className="flex items-center justify-center py-8 text-sm italic text-text-minor-emphasis/50">
          Sin comidas registradas
        </div>
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 flex-1 justify-center py-2.5 text-xs font-medium text-text-minor-emphasis hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer ${className ?? ""}`}
    >
      {icon}
      {label}
    </button>
  );
}

function getAssembledDayInfo(assembledDay: AssembledDayDTO | null | undefined) {
  const meals = assembledDay?.meals || [];
  const fakeMeals = assembledDay?.fakeMeals || [];
  const hasMeals = meals.length > 0 || fakeMeals.length > 0;

  const dayTotalCalories = assembledDay?.totalCalories ?? 0;
  const dayTotalProtein = assembledDay?.totalProtein ?? 0;

  const isToday = assembledDay?.isToday ?? false;
  const isPast = assembledDay?.isPast ?? false;

  return {
    meals,
    fakeMeals,
    hasMeals,
    dayTotalCalories,
    dayTotalProtein,
    isToday,
    isPast,
  };
}

export default DaySummary;
