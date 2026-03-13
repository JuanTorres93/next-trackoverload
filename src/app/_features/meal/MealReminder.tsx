'use client';

import Image from 'next/image';

import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { toggleIsEaten } from './actions';
import { useState } from 'react';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import LoadingOverlay from '../common/LoadingOverlay';
import { useRouter } from 'next/navigation';
import FoodReminderContainer from '../common/FoodReminderContainer';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';

function MealReminder({ meal }: { meal: MealDTO }) {
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

  return (
    <FoodReminderContainer
      className={`grid relative grid-cols-[5rem_1fr] items-center max-bp-navbar-mobile:grid-cols-[4rem_1fr] `}
      isEaten={meal.isEaten}
      onClick={handleToggleIsEaten}
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

      <div className="flex flex-col min-w-0 gap-1">
        <p className="text-lg font-semibold leading-snug max-bp-navbar-mobile:text-base">
          {meal.name}
        </p>

        <div className="flex items-center gap-1.5 text-sm opacity-75">
          <span className="font-medium">{calories} kcal</span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span>{protein} g proteína</span>
        </div>
      </div>
    </FoodReminderContainer>
  );
}

export default MealReminder;
