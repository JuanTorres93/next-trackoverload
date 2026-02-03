import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';

import { DayId } from '@/domain/value-objects/DayId/DayId';

import DaySummary from '@/app/_features/day/DaySummary';
import PageWrapper from '../../_ui/PageWrapper';
import { getAssembledDaysByIds } from '@/app/_features/day/actions';

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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(5rem,20rem))] gap-4">
        {assembledDays.map(({ dayId, assembledDay }) => (
          <DaySummary key={dayId} dayId={dayId} assembledDay={assembledDay} />
        ))}
      </div>
    </PageWrapper>
  );
}
