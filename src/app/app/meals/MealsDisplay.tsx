'use client';

import { AssembledDayResult } from '@/app/_features/day/actions';
import DaySummary from '@/app/_features/day/DaySummary';
import WeekSelector from '@/app/_features/day/WeekSelector';
import SelectRecipeModal from '@/app/_features/recipe/SelectRecipeModal';
import Modal from '@/app/_ui/Modal';
import { DayId, dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import { HiPlus } from 'react-icons/hi2';

function MealsDisplay({
  assembledDays,
}: {
  assembledDays: AssembledDayResult[];
}) {
  const [selectedDaysIds, setSelectedDaysIds] = useState<string[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);

  const areDaysSelected = selectedDaysIds.length > 0;

  useEffect(() => {
    const today = new Date();
    const todayDayId = DayId.create({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    }).value;

    const todayIndex = assembledDays.findIndex(
      ({ dayId }) => dayId === todayDayId,
    );
    if (todayIndex >= 0) setActiveDayIndex(todayIndex);

    document
      .getElementById(todayDayId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [assembledDays]);

  function handleSelectDay(dayId: string) {
    setSelectedDaysIds((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId],
    );
  }

  async function addMealsRequest(recipesIds: string[]) {
    const response = await fetch('/api/day/addMultipleMealsToMultipleDays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayIds: selectedDaysIds, recipeIds: recipesIds }),
    });
    if (response.ok) setSelectedDaysIds([]);
  }

  return (
    <Modal>
      {/* Sticky header — breaks out of PageWrapper padding via -mx-6 -mt-6 */}
      <div className="-mx-6 -mt-6 sticky top-0 z-10 bg-background border-b border-border/40">
        {/* Week navigation row */}
        <div className="flex items-center gap-3 px-6 py-2.5">
          <WeekSelector />

          {/* Multi-day selection actions — only shown when days are selected */}
          {areDaysSelected && (
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <span className="text-xs text-text-minor-emphasis hidden bp-navbar-mobile:inline">
                {selectedDaysIds.length} día
                {selectedDaysIds.length > 1 ? 's' : ''}
              </span>
              <Modal.Open opens="add-food-to-days-modal">
                <button className="flex items-center gap-1.5 text-sm font-medium bg-primary text-white rounded-lg px-3 py-1.5 hover:bg-primary-shade transition cursor-pointer">
                  <HiPlus size={15} />
                  Añadir
                </button>
              </Modal.Open>
              <button
                onClick={() => setSelectedDaysIds([])}
                className="flex items-center justify-center w-8 h-8 text-text-minor-emphasis border border-border rounded-lg hover:bg-surface-light transition cursor-pointer"
              >
                <HiX size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile day tabs */}
        <div className="border-t border-border/30 overflow-x-auto scrollbar-none bp-navbar-mobile:hidden">
          <div className="flex min-w-max px-3 py-1 gap-1">
            {assembledDays.map(({ dayId }, index) => (
              <MobileDayTab
                key={dayId}
                dayId={dayId}
                isActive={activeDayIndex === index}
                isSelected={selectedDaysIds.includes(dayId)}
                onClick={() => setActiveDayIndex(index)}
                onLongSelect={() => handleSelectDay(dayId)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="max-bp-navbar-mobile:hidden mt-4">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
          }}
        >
          {assembledDays.map(({ dayId, assembledDay }) => (
            <DaySummary
              key={dayId}
              dayId={dayId}
              assembledDay={assembledDay}
              onSelectDay={handleSelectDay}
              isSelected={selectedDaysIds.includes(dayId)}
            />
          ))}
        </div>
      </div>

      {/* Mobile single-day view */}
      <div className="bp-navbar-mobile:hidden mt-4">
        {assembledDays[activeDayIndex] && (
          <DaySummary
            key={assembledDays[activeDayIndex].dayId}
            dayId={assembledDays[activeDayIndex].dayId}
            assembledDay={assembledDays[activeDayIndex].assembledDay}
            onSelectDay={handleSelectDay}
            isSelected={selectedDaysIds.includes(
              assembledDays[activeDayIndex].dayId,
            )}
          />
        )}
      </div>

      <Modal.Window name="add-food-to-days-modal">
        <SelectRecipeModal addMealsRequest={addMealsRequest} />
      </Modal.Window>
    </Modal>
  );
}

function MobileDayTab({
  dayId,
  isActive,
  isSelected,
  onClick,
  onLongSelect,
}: {
  dayId: string;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  onLongSelect: () => void;
}) {
  const { day, month, year } = dayIdToDayMonthYear(dayId);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  const isToday =
    today.getDate() === day &&
    today.getMonth() + 1 === month &&
    today.getFullYear() === year;

  const dayInitial = format(date, 'EEEEE', { locale: es }).toUpperCase();
  const dayNum = format(date, 'd');

  return (
    <button
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongSelect();
      }}
      className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all cursor-pointer min-w-[2.75rem] relative
        ${isActive ? 'bg-primary text-white' : 'text-text-minor-emphasis hover:bg-surface-light'}
        ${isToday && !isActive ? 'font-semibold text-primary' : ''}
      `}
    >
      <span className="text-[10px] font-medium leading-none mb-0.5">
        {dayInitial}
      </span>
      <span className="text-sm font-semibold leading-none">{dayNum}</span>
      {isSelected && (
        <span className="absolute -top-0.5 -right-0.5 bg-selected text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
          <HiCheck size={8} />
        </span>
      )}
      {isToday && !isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );
}

export default MealsDisplay;
