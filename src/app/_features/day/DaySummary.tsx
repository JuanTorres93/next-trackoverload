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
        className={`p-2 border-2 rounded-xl border-surface-dark ${
          isToday ? 'border-3! shadow-md border-primary-light!' : ''
        } ${isPast ? 'opacity-60' : ''}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-.5">
            <DayTitle dayName={dayName} isToday={isToday} />
            <DateTitle day={day} month={month} year={year} />
          </div>

          {!assembledDay && (
            <Modal.Open opens="add-food-modal">
              <ButtonNew>Añadir comida</ButtonNew>
            </Modal.Open>
          )}
        </div>
      </div>

      <Modal.Window name="add-food-modal">
        <SelectRecipeModal />
      </Modal.Window>
    </Modal>
  );
}

// TODO NEXT Create test file

export default DaySummary;
