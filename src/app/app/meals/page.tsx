import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';

import { DayId } from '@/domain/value-objects/DayId/DayId';

import { getAssembledDaysByIds } from '@/app/_features/day/actions';
import PageWrapper from '../../_ui/PageWrapper';
import MealsDisplay from './MealsDisplay';
import WeekSelector from '@/app/_features/day/WeekSelector';
import { parseFilterValueToDate } from '@/app/_features/day/utils/parseFilterValueToDate';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Comidas',
  description: 'Planificación de comidas',
};

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;

  let currentDate = new Date();

  if (params.week) {
    currentDate = parseFilterValueToDate(params.week);
  }

  const dayStartWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const dayEndWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({
    start: dayStartWeek,
    end: dayEndWeek,
  });

  const dayIds = daysOfWeek.map(
    (day) =>
      DayId.create({
        day: day.getDate(),
        month: day.getMonth() + 1,
        year: day.getFullYear(),
      }).value,
  );

  const assembledDays = await getAssembledDaysByIds(dayIds);

  return (
    <PageWrapper>
      <WeekSelector className="mb-10" />
      <MealsDisplay assembledDays={assembledDays} />
    </PageWrapper>
  );
}
