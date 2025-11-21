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
}: {
  line: IngredientLineDTO | RecipeDTO;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
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
    <div className="grid grid-rows-[1fr_auto] h-full max-h-32 max-w-96 overflow-hidden rounded-xl  ">
      <div className="grid grid-cols-[40px_1fr_5rem_min-content] p-2  gap-4 items-center bg-neutral-100">
        <div className="relative h-12 overflow-hidden rounded-md aspect-square">
          <Image
            fill
            src={imageUrl}
            alt="Ingredient Image"
            className="object-cover"
          />
        </div>
        <span className="font-semibold">{name}</span>
        <div className="relative flex items-center text-neutral-500">
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
            <HiOutlineX className="text-xl cursor-pointer text-neutral-500 hover:text-red-500" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 p-2 text-sm text-center bg-neutral-200 text-neutral-600">
        <NutritionalInfoValue number={line.calories} label="Calorías" />
        <NutritionalInfoValue number={line.protein} label="Proteínas" />
      </div>
    </div>
  );
}

export default NutritionSummary;
