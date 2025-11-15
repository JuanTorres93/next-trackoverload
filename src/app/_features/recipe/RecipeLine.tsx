'use client';
import NutritionSummary from '@/app/_ui/NutritionSummary';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

function RecipeLine({ recipe }: { recipe: RecipeDTO }) {
  return <NutritionSummary line={recipe} />;
}

export default RecipeLine;
