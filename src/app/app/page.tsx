import PageWrapper from '../_ui/PageWrapper';

import { FakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { dateToDayId } from '@/domain/value-objects/DayId/DayId';
import {
  getAssembledDayById,
  getLastNumberOfDaysIncludingToday,
} from '../_features/day/actions';
import EatenMealsNutritionTracker from '../_features/meal/EatenMealsNutritionTracker';
import MealReminder from '../_features/meal/MealReminder';
import WeightTracker from '../_features/weight/WeightTracker';
import ButtonPrimary from '../_ui/buttons/ButtonPrimary';
import GridAutoCols from '../_ui/GridAutoCols';
import SectionHeading from '../_ui/typography/SectionHeading';
import EatenFakeMeal from '../_features/fakemeal/EatenFakeMeal';
import AddFoodButton from '../_features/common/AddFoodButton';

export const metadata = {
  title: 'Dashboard',
  description: 'Dashboard page',
};

export default async function Dashboard() {
  const todayId = dateToDayId(new Date());

  const promises = [
    getAssembledDayById(todayId.value),
    getLastNumberOfDaysIncludingToday(90),
  ] as const;
  const [assembledDayResult, daysHistory] = await Promise.all(promises);

  const mealsForToday: MealDTO[] = assembledDayResult.assembledDay?.meals || [];

  // Sort by isEaten last
  mealsForToday.sort((a, b) => {
    if (a.isEaten === b.isEaten) return 0;
    if (a.isEaten) return 1;
    return -1;
  });

  const fakeMealsForToday: FakeMealDTO[] =
    assembledDayResult.assembledDay?.fakeMeals || [];

  const todayHasMeals = [...mealsForToday, ...fakeMealsForToday].length > 0;

  return (
    <PageWrapper className="flex flex-col gap-10">
      <div>
        <SectionHeading>
          {todayHasMeals && '¿Has comido ya...?'}
          {!todayHasMeals && 'No hay comidas planificadas para hoy'}
        </SectionHeading>

        {todayHasMeals && (
          <div className="flex flex-col gap-4">
            <EatenMealsNutritionTracker
              meals={mealsForToday}
              fakeMeals={fakeMealsForToday}
            />

            <GridAutoCols
              className="gap-4"
              fitOrFill="fill"
              min="18rem"
              max="1fr"
            >
              {mealsForToday.map((meal) => (
                <MealReminder
                  key={meal.id}
                  meal={meal}
                  dayId={assembledDayResult.assembledDay!.id}
                />
              ))}

              {fakeMealsForToday.map((fakeMeal) => (
                <EatenFakeMeal
                  key={fakeMeal.id}
                  fakeMeal={fakeMeal}
                  dayId={assembledDayResult.assembledDay!.id}
                />
              ))}
            </GridAutoCols>

            <AddFoodButton dayId={assembledDayResult.assembledDay!.id} />
          </div>
        )}

        {!todayHasMeals && (
          <ButtonPrimary href="/app/meals">¡Añádelas!</ButtonPrimary>
        )}
      </div>

      <div>
        <SectionHeading>Evolución de tu peso</SectionHeading>
        <WeightTracker days={daysHistory} />
      </div>
    </PageWrapper>
  );
}
