import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import ButtonNew from '@/app/_ui/ButtonNew';
import { AssembledDayDTO } from '@/application-layer/dtos/DayDTO';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
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

  return (
    <div
      className={`p-2 border-2 rounded-xl border-surface-dark ${
        isToday ? 'border-3! shadow-md border-primary-light!' : ''
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <DayTitle dayName={dayName} isToday={isToday} />
        <DateTitle day={day} month={month} year={year} />
      </div>

      <div>{!assembledDay && <ButtonNew>Añadir comida</ButtonNew>}</div>
    </div>
  );
}

export default DaySummary;
