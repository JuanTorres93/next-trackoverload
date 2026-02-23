'use client';
import Input from '@/app/_ui/Input';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';
import CaloriesAndProtein from '../_features/common/CaloriesAndProtein';
import ButtonX from './ButtonX';
import LoggedMealContainer from '../_features/common/LoggedMealContainer';
import Spinner from './Spinner';

const quantityStyle = 'w-full text-right border-none outline-none';

function NutritionSummary({
  line,
  onQuantityChange,
  onRemove,
  className,
  disabled = false,
  isLoading = false,
}: {
  line: IngredientLineDTO | RecipeDTO;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
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

  const isDisabled = disabled || isLoading;

  return (
    <LoggedMealContainer className={className}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-light/30 backdrop-blur-[2px]">
          <Spinner />
        </div>
      )}

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
            <Input
              className={quantityStyle}
              disabled={isDisabled}
              containerClassName="border-0"
              type="number"
              defaultValue={quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              placeholder="gramos"
            >
              <span className="ml-1">g</span>
            </Input>
          )}

          {!onQuantityChange && (
            <span className={quantityStyle}>{quantity} g</span>
          )}
        </div>

        {onRemove && (
          <ButtonX
            data-testid="nutritional-summary-delete-button"
            onClick={onRemove}
            disabled={isDisabled}
          />
        )}
      </div>

      <CaloriesAndProtein calories={line.calories} protein={line.protein} />
    </LoggedMealContainer>
  );
}

export default NutritionSummary;
