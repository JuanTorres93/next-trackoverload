import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { AssembledDayDTO } from '@/application-layer/dtos/DayDTO';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import { prependOnDigitNumberWithZero } from './utils/prependOnDigitNumberWithZero';
import ButtonNew from '@/app/_ui/ButtonNew';

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
      <h2 className="flex flex-col items-center justify-center">
        <span>{dayName}</span>
        <span className="text-sm text-zinc-600">{`${prependOnDigitNumberWithZero(
          day,
        )}/${prependOnDigitNumberWithZero(month)}/${year}`}</span>
      </h2>

      <div>{!assembledDay && <ButtonNew>Añadir comida</ButtonNew>}</div>
    </div>
  );
}

export default DaySummary;
