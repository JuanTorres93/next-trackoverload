'use client';

// TODO Change file name

import { HiOutlineDuplicate, HiOutlineTrash } from 'react-icons/hi';
import IngredientLineItem from '@/app/_features/ingredient/IngredientLineItem';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { removeIngredientFromRecipe } from '@/app/_features/recipe/actions';
import { updateIngredientLineQuantity } from '@/app/_features/ingredient/actions';
import {
  duplicateRecipe,
  deleteRecipe,
  addIngredientToRecipe,
} from '@/app/_features/recipe/actions';
import { useDebounce } from '@/app/hooks/useDebounce';
import IngredientSearch, {
  handleIngredientSelection,
} from '@/app/_features/recipe/IngredientSearch';
import { useState } from 'react';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import ButtonNew from '@/app/_ui/ButtonNew';

interface RecipeDisplayProps {
  recipe: RecipeDTO;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  // TODO Filter ingredients that are already in the recipe
  const [newIngredientLines, setNewIngredientLines] = useState<
    IngredientLineDTO[]
  >([]);

  const debouncedUpdateQuantity = useDebounce(handleQuantityChange, 250);

  function handleRemoveIngredient(ingredientId: string) {
    removeIngredientFromRecipe(recipe.id, ingredientId);
  }

  function handleQuantityChange(lineId: string, quantity: number) {
    updateIngredientLineQuantity('recipe', recipe.id, lineId, quantity);
  }

  function handleAddIngredients(e: React.FormEvent) {
    e.preventDefault();

    for (const line of newIngredientLines) {
      addIngredientToRecipe(recipe.id, line);
    }

    setNewIngredientLines([]);
  }

  return (
    <div className="grid grid-cols-[1fr_min-content] gap-10 grid-rows-[min-content_1fr]">
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
        <HiOutlineTrash
          className="transition cursor-pointer hover:text-red-600"
          onClick={() => deleteRecipe(recipe.id)}
        />
      </div>

      <form className="flex flex-col gap-4">
        <h3>Añadir ingredientes</h3>
        <IngredientSearch
          onSelectFoundIngredient={(ingredient, isSelected) =>
            handleIngredientSelection(
              ingredient,
              isSelected,
              setNewIngredientLines
            )
          }
        />

        <IngredientSearch.IngredientList
          ingredientLines={newIngredientLines}
          setIngredientLines={setNewIngredientLines}
          showIngredientLabel={newIngredientLines.length > 0}
        />

        <ButtonNew
          type="submit"
          className={`${newIngredientLines.length <= 0 ? 'hidden' : ''}`}
          onClick={handleAddIngredients}
        >
          Añadir
        </ButtonNew>
      </form>
    </div>
  );
}
