'use client';
import ButtonX from '@/app/_ui/buttons/ButtonX';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import Image from 'next/image';
import { useState } from 'react';
import LoadingOverlay from '../common/LoadingOverlay';

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

  const calories = formatToInteger(ingredientLine.calories);
  const protein = formatToInteger(ingredientLine.protein);

  return (
    <div className="relative grid grid-cols-[2.75rem_1fr_auto_auto] items-center gap-x-3 p-3 rounded-xl border border-border/50 bg-surface-card hover:border-border/70 transition-colors">
      {isLoading && <LoadingOverlay className="rounded-xl" />}

      {/* Thumbnail */}
      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-surface-light">
        <Image
          fill
          src={
            ingredientLine.ingredient.imageUrl || '/ingredient-no-picture.webp'
          }
          alt={ingredientLine.ingredient.name}
          className="object-cover"
        />
      </div>

      {/* Name + macros — auto-shrinks in grid */}
      <div className="min-w-0">
        <p className="font-semibold text-sm text-text leading-tight truncate">
          {ingredientLine.ingredient.name}
        </p>
        <p className="text-xs text-text-minor-emphasis mt-0.5 truncate">
          <span>{calories}</span>
          <span> Calorías · </span>
          <span>{protein}</span>
          <span>g Proteínas</span>
        </p>
      </div>

      {/* Quantity — fixed-size, always visible */}
      <div className="flex items-center gap-1.5 border border-border/60 rounded-lg px-2.5 py-1.5 bg-input-background shrink-0">
        <input
          type="number"
          defaultValue={ingredientLine.quantityInGrams}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          disabled={isLoading}
          min={0}
          className="w-10 text-right text-sm outline-none bg-transparent text-text disabled:cursor-not-allowed disabled:text-text-minor-emphasis"
        />
        <span className="text-xs font-medium text-text-minor-emphasis leading-none">
          g
        </span>
      </div>

      {/* Remove — always visible */}
      <ButtonX
        data-testid="nutritional-summary-delete-button"
        onClick={handleRemove}
        disabled={isLoading}
      />
    </div>
  );
}

export default IngredientLineItem;
