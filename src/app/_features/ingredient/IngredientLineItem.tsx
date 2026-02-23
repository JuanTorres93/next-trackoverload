'use client';
import NutritionSummary from '@/app/_ui/NutritionSummary';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { useState } from 'react';

function IngredientLineItem({
  ingredientLine,
  onQuantityChange,
  onRemove,
}: {
  ingredientLine: IngredientLineDTO;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    setIsLoading(true);

    try {
      await onRemove();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <NutritionSummary
      line={ingredientLine}
      onQuantityChange={onQuantityChange}
      onRemove={handleRemove}
      isLoading={isLoading}
    />
  );
}

export default IngredientLineItem;
