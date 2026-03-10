import PageWrapper from '../_ui/PageWrapper';

import { dateToDayId } from '@/domain/value-objects/DayId/DayId';
import { getAllMealsInDayForUser } from '../_features/meal/actions';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import MealReminder from '../_features/meal/MealReminder';
import GridAutoCols from '../_ui/GridAutoCols';
import SectionHeading from '../_ui/typography/SectionHeading';

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard page',
};

export default async function Dashboard() {
  const todayId = dateToDayId(new Date());
  const mealsForToday: MealDTO[] = await getAllMealsInDayForUser(todayId.value);

  const todayHasMeals = mealsForToday.length > 0;

  return (
    <PageWrapper>
      {todayHasMeals && (
        <>
          <SectionHeading>¿Has comido ya...?</SectionHeading>
          <GridAutoCols
            className="gap-4"
            fitOrFill="fill"
            min="18rem"
            max="1fr"
          >
            {mealsForToday.map((meal) => (
              <MealReminder key={meal.id} meal={meal} />
            ))}
          </GridAutoCols>
        </>
      )}

      {!todayHasMeals && <p>No hay comidas planificadas para hoy</p>}
    </PageWrapper>
  );
}
