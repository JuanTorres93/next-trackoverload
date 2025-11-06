'use client';

import IngredientLineItem from '@/app/_features/ingredient/IngredientLineItem';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

interface RecipeDisplayProps {
  recipe: RecipeDTO;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const handleRemoveIngredient = (lineId: string) => {
    // TODO: Implement ingredient removal logic
    console.log('Remove ingredient line:', lineId);
  };

  const handleQuantityChange = (lineId: string, quantity: number) => {
    // TODO: Implement quantity change logic
    console.log('Change quantity for line:', lineId, 'to:', quantity);
  };

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {recipe.ingredientLines.map((line) => (
          <IngredientLineItem
            key={line.id}
            ingredientLine={line}
            onRemove={() => handleRemoveIngredient(line.id)}
            onQuantityChange={(quantity) =>
              handleQuantityChange(line.id, quantity)
            }
          />
        ))}
      </div>
    </div>
  );
}
