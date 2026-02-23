import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';

import { DayId } from '@/domain/value-objects/DayId/DayId';

import { getAssembledDaysByIds } from '@/app/_features/day/actions';
import PageWrapper from '../../_ui/PageWrapper';
import MealsDisplay from './MealsDisplay';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Comidas',
  description: 'Planificación de comidas',
};

export default async function MealsPage() {
  const now = new Date();
  const dayStartWeek = startOfWeek(now, { weekStartsOn: 1 });
  const dayEndWeek = endOfWeek(now, { weekStartsOn: 1 });
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
      <MealsDisplay assembledDays={assembledDays} />
    </PageWrapper>
  );
}
