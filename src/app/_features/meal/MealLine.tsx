'use client';
import NutritionSummary from '@/app/_ui/NutritionSummary';
import { MealDTO } from '@/application-layer/dtos/MealDTO';

function MealLine({ meal, className }: { meal: MealDTO; className?: string }) {
  return <NutritionSummary line={meal} className={className} />;
}

export default MealLine;
