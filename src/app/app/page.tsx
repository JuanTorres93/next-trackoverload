import PageWrapper from '../_ui/PageWrapper';

import { dateToDayId } from '@/domain/value-objects/DayId/DayId';
import { getAllMealsInDayForUser } from '../_features/meal/actions';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import MealReminder from '../_features/meal/MealReminder';
import GridAutoCols from '../_ui/GridAutoCols';
import SectionHeading from '../_ui/typography/SectionHeading';
import ButtonPrimary from '../_ui/buttons/ButtonPrimary';
import EatenMealsNutritionTracker from '../_features/meal/EatenMealsNutritionTracker';
import WeightTracker from '../_features/weight/WeightTracker';
import { getLastNumberOfDaysIncludingToday } from '../_features/day/actions';

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard page',
};

export default async function Dashboard() {
  const todayId = dateToDayId(new Date());
  const mealsForToday: MealDTO[] = await getAllMealsInDayForUser(todayId.value);

  // TODO IMPORTANT: allow user to configure days, maybe with a URL query param like ?days=14 or something like that
  const daysHistory = await getLastNumberOfDaysIncludingToday(7);

  const todayHasMeals = mealsForToday.length > 0;

  return (
    <PageWrapper>
      <SectionHeading>
        {todayHasMeals && '¿Has comido ya...?'}
        {!todayHasMeals && 'No hay comidas planificadas para hoy'}
      </SectionHeading>

      {todayHasMeals && (
        <div className="flex flex-col gap-4">
          <EatenMealsNutritionTracker meals={mealsForToday} />

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
        </div>
      )}

      {!todayHasMeals && (
        <ButtonPrimary href="/app/meals">¡Añádelas!</ButtonPrimary>
      )}

      <WeightTracker days={daysHistory} />
    </PageWrapper>
  );
}
