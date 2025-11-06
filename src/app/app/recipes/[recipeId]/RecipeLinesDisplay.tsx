'use client';

import IngredientLineItem from '@/app/_features/ingredient/IngredientLineItem';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { removeIngredientFromRecipe } from '@/app/_features/recipe/actions';

interface RecipeDisplayProps {
  recipe: RecipeDTO;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const handleRemoveIngredient = (ingredientId: string) => {
    removeIngredientFromRecipe(recipe.id, ingredientId);
  };

  const handleQuantityChange = (lineId: string, quantity: number) => {
    // TODO: Implement quantity change logic
    console.log('Change quantity for line:', lineId, 'to:', quantity);
  };

  return (
    <div>
      <ul>
        {recipe.ingredientLines.map((line) => (
          <li key={line.id}>
            <IngredientLineItem
              ingredientLine={line}
              onRemove={() => handleRemoveIngredient(line.ingredient.id)}
              onQuantityChange={(quantity) =>
                handleQuantityChange(line.id, quantity)
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
