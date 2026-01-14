'use client';
import NutritionSummary from '@/app/_ui/NutritionSummary';
import { MealDTO } from '@/application-layer/dtos/MealDTO';

function MealLine({ meal }: { meal: MealDTO }) {
  return <NutritionSummary line={meal} />;
}

export default MealLine;
