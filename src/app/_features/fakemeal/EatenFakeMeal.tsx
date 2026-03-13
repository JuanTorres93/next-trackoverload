'use client';
import { FakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';
import FoodReminderContainer from '../common/FoodReminderContainer';
import FoodReminderMacros from '../common/FoodReminderMacros';
import {
  replaceFakeMealByAnotherFakeMealForUserInDay,
  replaceFakeMealByMealForUserInDay,
} from '../day/actions';

function EatenFakeMeal({
  fakeMeal,
  dayId,
}: {
  fakeMeal: FakeMealDTO;
  dayId: string;
}) {
  const replacement = {
    replaceMealRequest: (recipeId: string) =>
      replaceFakeMealByMealForUserInDay(fakeMeal.id, recipeId, dayId),

    replaceFakeMealRequest: (name: string, calories: number, protein: number) =>
      replaceFakeMealByAnotherFakeMealForUserInDay(
        fakeMeal.id,
        name,
        calories,
        protein,
        dayId,
      ),
  };

  return (
    <FoodReminderContainer isEaten replacement={replacement}>
      <div className="flex flex-col gap-2 p-3 cursor-default">
        <p className="font-semibold leading-snug">{fakeMeal.name}</p>

        <FoodReminderMacros
          calories={fakeMeal.calories}
          protein={fakeMeal.protein}
        />
      </div>
    </FoodReminderContainer>
  );
}

export default EatenFakeMeal;
