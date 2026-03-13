'use client';

import Image from 'next/image';

import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { toggleIsEaten } from './actions';
import { useState } from 'react';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import LoadingOverlay from '../common/LoadingOverlay';
import { useRouter } from 'next/navigation';
import FoodReminderContainer from '../common/FoodReminderContainer';

function MealReminder({ meal }: { meal: MealDTO }) {
  const router = useRouter();

  const [isTogglingEaten, setIsTogglingEaten] = useState(false);

  const defaultImageUrl = '/recipe-no-picture.png';

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

      <p className="w-full text-lg font-medium max-bp-navbar-mobile:text-base">
        {meal.name}
      </p>
    </FoodReminderContainer>
  );
}

export default MealReminder;
