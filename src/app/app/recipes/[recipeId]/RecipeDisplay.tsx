'use client';

import { updateIngredientLineQuantity } from '@/app/_features/ingredient/actions';
import IngredientLineItem from '@/app/_features/ingredient/IngredientLineItem';
import {
  addIngredientToRecipe,
  deleteRecipe,
  duplicateRecipe,
  removeIngredientFromRecipe,
} from '@/app/_features/recipe/actions';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { HiOutlineDuplicate, HiOutlineTrash } from 'react-icons/hi';

import IngredientSearch, {
  IngredientLineWithExternalRef,
} from '@/app/_features/ingredient/IngredientSearch';
import ButtonNew from '@/app/_ui/ButtonNew';
import { useDebounce } from '@/app/_hooks/useDebounce';
import { useState } from 'react';

interface RecipeDisplayProps {
  recipe: RecipeDTO;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  // TODO Filter ingredients that are already in the recipe
  const [
    newIngredientLinesWithExternalRefs,
    setNewIngredientLinesWithExternalRefs,
  ] = useState<IngredientLineWithExternalRef[]>([]);

  const debouncedUpdateQuantity = useDebounce(handleQuantityChange, 250);

  async function handleRemoveIngredient(ingredientId: string) {
    if (recipe.ingredientLines.length <= 1) return;

    try {
      await removeIngredientFromRecipe(recipe.id, ingredientId);
    } catch {
      // Right now, this trycatch block is included to prevent error logs in testing
    }
  }

  function handleQuantityChange(lineId: string, quantity: number) {
    updateIngredientLineQuantity('recipe', recipe.id, lineId, quantity);
  }

  async function handleAddIngredients(e: React.FormEvent) {
    // TODO handle loading state
    e.preventDefault();

    for (const line of newIngredientLinesWithExternalRefs) {
      const externalRef = line.ingredientExternalRef;

      const ingredientLine = line.ingredientLine;

      addIngredientToRecipe(
        recipe.id,
        externalRef.externalId,
        externalRef.source,
        ingredientLine.ingredient.name,
        ingredientLine.ingredient.nutritionalInfoPer100g.calories,
        ingredientLine.ingredient.nutritionalInfoPer100g.protein,
        ingredientLine.ingredient.imageUrl,
        ingredientLine.quantityInGrams,
      );
    }

    setNewIngredientLinesWithExternalRefs([]);
  }

  return (
    <div className="grid grid-cols-[1fr_min-content] gap-10 grid-rows-[min-content_1fr]">
      <div
        data-testid="ingredient-lines-container"
        className="grid row-span-2 gap-4 grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] auto-rows-min"
      >
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
          data-testid="duplicate-recipe-button"
          className="transition cursor-pointer hover:text-primary-light"
          onClick={() => duplicateRecipe(recipe.id)}
        />
        <HiOutlineTrash
          data-testid="delete-recipe-button"
          className="transition cursor-pointer hover:text-error"
          onClick={() => deleteRecipe(recipe.id)}
        />
      </div>

      <form className="flex flex-col gap-4">
        <h3>Añadir ingredientes</h3>
        <IngredientSearch
          onIngredientSelection={setNewIngredientLinesWithExternalRefs}
        >
          <div className="flex items-center justify-center gap-4">
            <IngredientSearch.Search className="w-full max-w-120" />
            <IngredientSearch.BarcodeSearch />
          </div>

          <IngredientSearch.FoundIngredientsList className="my-4" />

          <IngredientSearch.SelectedIngredientsList
            containerClassName="mt-8"
            className="max-h-80!"
            showIngredientLabel={newIngredientLinesWithExternalRefs.length > 0}
          />
        </IngredientSearch>

        <ButtonNew
          type="submit"
          className={`${
            newIngredientLinesWithExternalRefs.length <= 0 ? 'hidden' : ''
          }`}
          onClick={handleAddIngredients}
        >
          Añadir
        </ButtonNew>
      </form>
    </div>
  );
}
