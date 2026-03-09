import PageWrapper from '../_ui/PageWrapper';

import { dateToDayId } from '@/domain/value-objects/DayId/DayId';
import { getAllMealsInDayForUser } from '../_features/meal/actions';
import { MealDTO } from '@/application-layer/dtos/MealDTO';

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
      {todayHasMeals &&
        mealsForToday.map((meal) => <div key={meal.id}>{meal.name}</div>)}

      {!todayHasMeals && <p>No hay comidas planificadas para hoy</p>}
    </PageWrapper>
  );
}
