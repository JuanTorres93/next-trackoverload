'use client';
import Input from '@/app/_ui/Input';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';
import { HiOutlineX } from 'react-icons/hi';

const quantityStyle = 'w-full text-right border-none outline-none';

function NutritionSummary({
  line,
  onQuantityChange,
  onRemove,
  className,
}: {
  line: IngredientLineDTO | RecipeDTO;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  className?: string;
}) {
  const isIngredientLine = 'ingredient' in line;
  const defaultImageUrl = '/ingredient-no-picture.png';
  const imageUrl = isIngredientLine
    ? line.ingredient.imageUrl || defaultImageUrl
    : line.imageUrl || defaultImageUrl;

  const name = isIngredientLine ? line.ingredient.name : line.name;
  const quantity = isIngredientLine
    ? line.quantityInGrams
    : line.ingredientLines.reduce((sum, il) => sum + il.quantityInGrams, 0);

  return (
    <div
      className={`grid  grid-rows-[1fr_auto] h-full max-h-48 overflow-hidden rounded-xl ${className}`}
    >
      <div className="grid grid-cols-[40px_1fr_5rem_min-content] p-2  gap-4 items-center bg-surface-card">
        <div className="relative h-12 overflow-hidden rounded-md aspect-square">
          <Image
            fill
            src={imageUrl}
            alt="Ingredient Image"
            className="object-cover"
          />
        </div>
        <span className="font-semibold">{name}</span>
        <div className="relative flex items-center text-text-minor-emphasis">
          {onQuantityChange && (
            <>
              <Input
                className={quantityStyle}
                type="number"
                defaultValue={quantity}
                onChange={(e) => onQuantityChange(Number(e.target.value))}
                placeholder="gramos"
              />
              <span className="ml-[-.5rem]">g</span>
            </>
          )}

          {!onQuantityChange && (
            <span className={quantityStyle}>{quantity} g</span>
          )}
        </div>

        {onRemove && (
          <div
            data-testid="nutritional-summary-delete-button"
            onClick={onRemove}
          >
            <HiOutlineX className="text-xl cursor-pointer text-text-minor-emphasis hover:text-error" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 p-2 text-sm text-center bg-surface-dark ">
        <NutritionalInfoValue
          lightText={true}
          number={line.calories}
          label="Calorías"
        />
        <NutritionalInfoValue
          lightText={true}
          number={line.protein}
          label="Proteínas"
        />
      </div>
    </div>
  );
}

export default NutritionSummary;
