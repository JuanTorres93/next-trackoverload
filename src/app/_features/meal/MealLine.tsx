'use client';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { removeMealFromDay } from '../day/actions';
import { useState } from 'react';
import Image from 'next/image';
import ButtonX from '@/app/_ui/buttons/ButtonX';
import LoadingOverlay from '../common/LoadingOverlay';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';

function MealLine({
  meal,
  className,
  dayId,
}: {
  meal: MealDTO;
  className?: string;
  dayId?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    if (!dayId) return;
    setIsLoading(true);
    try {
      await removeMealFromDay(dayId, meal.id);
    } finally {
      setIsLoading(false);
    }
  }

  const imageUrl = meal.imageUrl || '/recipe-no-picture.webp';

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-2.5 bg-surface-card ${className ?? ''}`}
    >
      {isLoading && <LoadingOverlay />}

      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-border/40">
        <Image fill src={imageUrl} alt={meal.name} className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-text truncate">{meal.name}</p>
        <p className="text-xs text-text-minor-emphasis">
          {formatToInteger(meal.calories)} kcal ·{' '}
          {formatToInteger(meal.protein)} g prot
        </p>
      </div>

      {dayId && (
        <ButtonX
          data-testid="nutritional-summary-delete-button"
          onClick={handleRemove}
        />
      )}
    </div>
  );
}

export default MealLine;
