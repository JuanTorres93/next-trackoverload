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
import SectionHeading from '@/app/_ui/typography/SectionHeading';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import Modal from '@/app/_ui/Modal';
import { showErrorToast } from '@/app/_ui/showErrorToast';

interface RecipeDisplayProps {
  recipe: RecipeDTO;
}

export default function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  // TODO Filter ingredients that are already in the recipe
  const [
    newIngredientLinesWithExternalRefs,
    setNewIngredientLinesWithExternalRefs,
  ] = useState<IngredientLineWithExternalRef[]>([]);
  // TODO handle loading state

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
    e.preventDefault();

    for (const line of newIngredientLinesWithExternalRefs) {
      const externalRef = line.ingredientExternalRef;

      const ingredientLine = line.ingredientLine;

      await addIngredientToRecipe(
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
    <div>
      <Modal>
        <SectionHeading>
          <h2>Ingredientes</h2>
        </SectionHeading>

        <div className="flex gap-4 mb-6">
          <Modal.Open opens="add-ingredient-modal">
            <ButtonNew data-testid="add-ingredient-modal-button">Añadir ingredientes</ButtonNew>
          </Modal.Open>

          <ButtonPrimary
            className="flex items-center gap-2"
            data-testid="duplicate-recipe-button"
            onClick={() => duplicateRecipe(recipe.id)}
          >
            <HiOutlineDuplicate />
            <span>Duplicar receta</span>
          </ButtonPrimary>

          <ButtonPrimary
            className="flex items-center gap-2 border-error! text-error! hover:bg-error! hover:text-text-light! hover:border-error!"
            data-testid="delete-recipe-button"
            onClick={() => deleteRecipe(recipe.id)}
          >
            <HiOutlineTrash />
            <span>Eliminar receta</span>
          </ButtonPrimary>
        </div>

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
        </div>

        <Modal.Window name="add-ingredient-modal">
          <AddIngredientModal
            setNewIngredientLinesWithExternalRefs={
              setNewIngredientLinesWithExternalRefs
            }
            newIngredientLinesWithExternalRefs={
              newIngredientLinesWithExternalRefs
            }
            handleAddIngredients={handleAddIngredients}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
}

function AddIngredientModal({
  setNewIngredientLinesWithExternalRefs,
  newIngredientLinesWithExternalRefs,
  handleAddIngredients,
  onCloseModal,
}: {
  setNewIngredientLinesWithExternalRefs: React.Dispatch<
    React.SetStateAction<IngredientLineWithExternalRef[]>
  >;
  newIngredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  handleAddIngredients: (e: React.FormEvent) => Promise<void>;
  onCloseModal?: () => void;
}) {
  async function addIngredients(e: React.FormEvent) {
    try {
      await handleAddIngredients(e);
      onCloseModal?.();
    } catch {
      showErrorToast(
        'Error al añadir los ingredientes. Por favor, inténtalo de nuevo.',
      );
    }
  }

  return (
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
        onClick={addIngredients}
      >
        Añadir
      </ButtonNew>
    </form>
  );
}
