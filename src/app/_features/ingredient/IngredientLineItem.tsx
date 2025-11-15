'use client';
import NutritionSummary from '@/app/_ui/NutritionSummary';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';

function IngredientLineItem({
  ingredientLine,
  onQuantityChange,
  onRemove,
}: {
  ingredientLine: IngredientLineDTO;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <NutritionSummary
      line={ingredientLine}
      onQuantityChange={onQuantityChange}
      onRemove={onRemove}
    />
  );
}

export default IngredientLineItem;
