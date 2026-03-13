'use client';

import Image from 'next/image';

import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { toggleIsEaten } from './actions';
import { useState } from 'react';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import LoadingOverlay from '../common/LoadingOverlay';
import { useRouter } from 'next/navigation';
import FoodReminderContainer from '../common/FoodReminderContainer';
import FoodReminderMacros from '../common/FoodReminderMacros';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import {
  replaceMealByAnotherMealForUserInDay,
  replaceMealByFakeMealForUserInDay,
} from '../day/actions';

function MealReminder({ meal, dayId }: { meal: MealDTO; dayId: string }) {
  const router = useRouter();

  const [isTogglingEaten, setIsTogglingEaten] = useState(false);

  const defaultImageUrl = '/recipe-no-picture.png';

  const calories = formatToInteger(meal.calories);
  const protein = formatToInteger(meal.protein);

  async function handleToggleIsEaten() {
    if (isTogglingEaten) return;

    setIsTogglingEaten(true);

    try {
      await toggleIsEaten(meal.id);

      router.refresh();
    } catch {
      showErrorToast(
        'No se ha podido marcar la comida como "' +
          (meal.isEaten ? 'no comida' : 'comida') +
          '"',
      );
    } finally {
      setIsTogglingEaten(false);
    }
  }

  const replacement = {
    replaceMealRequest: (recipeId: string) =>
      replaceMealByAnotherMealForUserInDay(dayId, meal.id, recipeId),

    replaceFakeMealRequest: (name: string, calories: number, protein: number) =>
      replaceMealByFakeMealForUserInDay(
        dayId,
        meal.id,
        name,
        calories,
        protein,
      ),
  };

  return (
    <FoodReminderContainer
      isEaten={meal.isEaten}
      onClick={handleToggleIsEaten}
      replacement={replacement}
    >
      <div
        className={`grid gap-4 grid-cols-[5rem_1fr] items-center content-center max-bp-navbar-mobile:grid-cols-[4rem_1fr] `}
      >
        {isTogglingEaten && <LoadingOverlay />}

        <div className="relative overflow-hidden rounded-md shadow-xm aspect-square">
          <Image
            src={meal.imageUrl || defaultImageUrl}
            alt={meal.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0 gap-2">
          <p className="text-lg font-semibold leading-snug max-bp-navbar-mobile:text-base">
            {meal.name}
          </p>

          <FoodReminderMacros calories={calories} protein={protein} />
        </div>
      </div>
    </FoodReminderContainer>
  );
}

export default MealReminder;
