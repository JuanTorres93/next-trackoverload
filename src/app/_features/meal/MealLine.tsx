'use client';
import NutritionSummary from '@/app/_ui/NutritionSummary';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { removeMealFromDay } from '../day/actions';

function MealLine({
  meal,
  className,
  dayId,
}: {
  meal: MealDTO;
  className?: string;
  dayId?: string;
}) {
  return (
    <NutritionSummary
      line={meal}
      className={className}
      onRemove={
        dayId ? async () => removeMealFromDay(dayId, meal.id) : undefined
      }
    />
  );
}

export default MealLine;
