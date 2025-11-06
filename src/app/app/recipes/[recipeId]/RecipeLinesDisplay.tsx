'use client';

import IngredientLineItem from '@/app/_features/ingredient/IngredientLineItem';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { removeIngredientFromRecipe } from '@/app/_features/recipe/actions';
import { updateIngredientLineQuantity } from '@/app/_features/ingredient/actions';

interface RecipeDisplayProps {
  recipe: RecipeDTO;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const handleRemoveIngredient = (ingredientId: string) => {
    removeIngredientFromRecipe(recipe.id, ingredientId);
  };

  const handleQuantityChange = (lineId: string, quantity: number) => {
    updateIngredientLineQuantity('recipe', recipe.id, lineId, quantity);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipe.ingredientLines.map((line) => (
          <div key={line.id}>
            <IngredientLineItem
              ingredientLine={line}
              onRemove={() => handleRemoveIngredient(line.ingredient.id)}
              onQuantityChange={(quantity) =>
                handleQuantityChange(line.id, quantity)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
