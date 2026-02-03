'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import ButtonNew from '@/app/_ui/ButtonNew';
import Modal from '@/app/_ui/Modal';
import { AssembledDayDTO } from '@/application-layer/dtos/DayDTO';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import SelectRecipeModal from '../recipe/SelectRecipeModal';
import DateTitle from './DateTitle';
import DayTitle from './DayTitle';
import MealLine from '../meal/MealLine';

const computeIsToday = (day: number, month: number, year: number) => {
  const today = new Date();
  return (
    today.getDate() === day &&
    today.getMonth() + 1 === month &&
    today.getFullYear() === year
  );
};

const computeIsPast = (day: number, month: number, year: number) => {
  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const targetDate = new Date(year, month - 1, day);
  return targetDate < todayDateOnly;
};

function DaySummary({
  dayId,
  assembledDay,
}: {
  dayId: string; // dayId represented as string in DayId value object
  assembledDay?: AssembledDayDTO | null;
}) {
  const { day, month, year } = dayIdToDayMonthYear(dayId);

  const meals = assembledDay?.meals || [];
  // TODO NEXT manage fakeMeals

  // Compute day name And capitalize first letter
  const date = new Date(year, month - 1, day);
  const dayName =
    format(date, 'EEEE', { locale: es }).charAt(0).toUpperCase() +
    format(date, 'EEEE', { locale: es }).slice(1);

  const isToday = computeIsToday(day, month, year);
  const isPast = computeIsPast(day, month, year);

  return (
    <Modal>
      <div
        className={`border-2 rounded-xl border-surface-dark overflow-x-hidden ${
          isToday ? 'border-3! shadow-md border-primary-light!' : ''
        } ${isPast ? 'opacity-60' : ''}`}
      >
        <div
          className={`flex flex-col p-2 items-center bg-text-minor-emphasis justify-center gap-.5 ${isToday ? 'bg-primary-light!' : ''}`}
        >
          <DayTitle dayName={dayName} isToday={isToday} />
          <DateTitle day={day} month={month} year={year} />
        </div>

        <div className="grid grid-cols-1 overflow-x-scroll max-h-100">
          {meals.length > 0 &&
            meals.map((meal) => (
              <MealLine
                className="m-3"
                key={meal.id}
                meal={meal}
                dayId={dayId}
              />
            ))}
        </div>

        <div className="flex mt-3">
          <Modal.Open opens="add-food-modal">
            <ButtonNew className="w-full m-2">Comida</ButtonNew>
          </Modal.Open>

          <Modal.Open opens="add-fake-meal-modal">
            <ButtonNew className="w-full m-2">Rápido</ButtonNew>
          </Modal.Open>
        </div>
      </div>

      <Modal.Window name="add-food-modal">
        <SelectRecipeModal dayId={dayId} />
      </Modal.Window>

      <Modal.Window name="add-fake-meal-modal">
        <div className="p-4">Aquí va el modal de añadir comida rápida</div>
      </Modal.Window>
    </Modal>
  );
}

export default DaySummary;
