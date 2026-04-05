"use client";
import Image from "next/image";

import { useState } from "react";

import Input from "@/app/_ui/Input";
import ButtonX from "@/app/_ui/buttons/ButtonX";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";
import { IngredientLineDTO } from "@/application-layer/dtos/IngredientLineDTO";

import LoadingOverlay from "../common/LoadingOverlay";

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

  const calories = formatToInteger(ingredientLine.calories);
  const protein = formatToInteger(ingredientLine.protein);

  async function handleRemove() {
    setIsLoading(true);

    try {
      await onRemove();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative grid grid-cols-[2.75rem_1fr_auto_auto] items-center gap-x-3 p-3 rounded-xl border border-border/50 bg-surface-card hover:border-border/70 transition-colors">
      {isLoading && <LoadingOverlay className="rounded-xl" />}

      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-lg w-11 h-11 bg-surface-light">
        <Image
          fill
          src={
            ingredientLine.ingredient.imageUrl || "/ingredient-no-picture.webp"
          }
          alt={ingredientLine.ingredient.name}
          className="object-cover"
        />
      </div>

      {/* Name + macros  */}
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight truncate text-text">
          {ingredientLine.ingredient.name}
        </p>

        <div className="flex flex-wrap gap-x-2 mt-0.5">
          <span className="text-xs text-text-minor-emphasis whitespace-nowrap">
            <span>{calories}</span>
            <span> Calorías</span>
          </span>

          <span className="text-xs text-text-minor-emphasis whitespace-nowrap">
            <span>{protein}</span>
            <span>g Proteínas</span>
          </span>
        </div>
      </div>

      {/* Quantity  */}
      <Input
        type="number"
        defaultValue={ingredientLine.quantityInGrams}
        onChange={(e) => onQuantityChange(Number(e.target.value))}
        disabled={isLoading}
        min={0}
        className="w-10 text-sm text-right"
        containerClassName="gap-1.5 px-2.5 py-1.5 min-w-0 shrink-0 border-border/60"
      >
        <span className="text-xs font-medium leading-none text-text-minor-emphasis">
          g
        </span>
      </Input>

      {/* Remove  */}
      <ButtonX
        data-testid="nutritional-summary-delete-button"
        onClick={handleRemove}
        disabled={isLoading}
      />
    </div>
  );
}

export default IngredientLineItem;
