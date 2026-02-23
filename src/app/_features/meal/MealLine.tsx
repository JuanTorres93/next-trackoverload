'use client';
import NutritionSummary from '@/app/_ui/NutritionSummary';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { removeMealFromDay } from '../day/actions';
import { useState } from 'react';

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

  return (
    <NutritionSummary
      line={meal}
      className={className}
      isLoading={isLoading}
      onRemove={handleRemove}
    />
  );
}

export default MealLine;
