'use client';

import { HiOutlineDuplicate, HiX } from 'react-icons/hi';
import IngredientLineItem from '@/app/_features/ingredient/IngredientLineItem';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { removeIngredientFromRecipe } from '@/app/_features/recipe/actions';
import { updateIngredientLineQuantity } from '@/app/_features/ingredient/actions';
import { duplicateRecipe, deleteRecipe } from '@/app/_features/recipe/actions';
import { useDebounce } from '@/app/hooks/useDebounce';
import IngredientSearch from '@/app/_features/recipe/IngredientSearch';

interface RecipeDisplayProps {
  recipe: RecipeDTO;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const debouncedUpdateQuantity = useDebounce(handleQuantityChange, 250);

  function handleRemoveIngredient(ingredientId: string) {
    removeIngredientFromRecipe(recipe.id, ingredientId);
  }

  function handleQuantityChange(lineId: string, quantity: number) {
    updateIngredientLineQuantity('recipe', recipe.id, lineId, quantity);
  }

  return (
    <div className="grid grid-cols-[1fr_min-content] gap-10 grid-rows-[5rem_1fr]">
      <div className="grid row-span-2 gap-4 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] auto-rows-min">
        {recipe.ingredientLines.map((line) => (
          <IngredientLineItem
            key={line.id}
            ingredientLine={line}
            onRemove={() => handleRemoveIngredient(line.ingredient.id)}
            onQuantityChange={(quantity) =>
              debouncedUpdateQuantity(line.id, quantity)
            }
          />
        ))}
      </div>

      <div className="flex justify-end gap-4 text-4xl">
        <HiOutlineDuplicate
          className="transition cursor-pointer hover:text-green-600"
          onClick={() => duplicateRecipe(recipe.id)}
        />
        <HiX
          className="transition cursor-pointer hover:text-red-600"
          onClick={() => deleteRecipe(recipe.id)}
        />
      </div>

      <div>
        <h3>Añadir ingredientes</h3>
        <IngredientSearch />
      </div>
    </div>
  );
}
