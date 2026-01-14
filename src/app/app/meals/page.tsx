import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';

import { DayId } from '@/domain/value-objects/DayId/DayId';
import { AppGetAssembledDayById } from '@/interface-adapters/app/use-cases/day';

import DaySummary from '@/app/_features/day/DaySummary';
import PageWrapper from '../../_ui/PageWrapper';

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
      }).value
  );
  // TODO IMPORTANT: Create a new usecase to fetch a list of assembled days for better performance
  const assembledDaysPromises = dayIds.map((dayId) =>
    AppGetAssembledDayById.execute({
      dayId,
      userId: 'dev-user', // TODO: Replace with auth userId
    }).then((assembledDay) => ({ dayId, assembledDay }))
  );

  const assembledDays = await Promise.all(assembledDaysPromises);

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {assembledDays.map(({ dayId, assembledDay }) => (
          <DaySummary key={dayId} dayId={dayId} assembledDay={assembledDay} />
        ))}
      </div>
    </PageWrapper>
  );
}
