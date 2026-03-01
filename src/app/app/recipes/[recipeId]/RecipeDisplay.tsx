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

import { isNextRedirectError } from '@/app/_features/common/handleNextRedirectError';
import IngredientSearch, {
  IngredientLineWithExternalRef,
} from '@/app/_features/ingredient/IngredientSearch';
import { useDebounce } from '@/app/_hooks/useDebounce';
import ButtonNew from '@/app/_ui/ButtonNew';
import ButtonPrimary from '@/app/_ui/ButtonPrimary';
import Modal from '@/app/_ui/Modal';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import SpinnerMini from '@/app/_ui/SpinnerMini';
import SectionHeading from '@/app/_ui/typography/SectionHeading';
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

  const [isLoading, setIsLoading] = useState(false);
  const [isAddingIngredients, setIsAddingIngredients] = useState(false);
  const [isDuplicatingRecipe, setIsDuplicatingRecipe] = useState(false);
  const [isDeletingRecipe, setIsDeletingRecipe] = useState(false);

  const buttonsDisabled =
    isLoading || isAddingIngredients || isDuplicatingRecipe || isDeletingRecipe;

  const debouncedUpdateQuantity = useDebounce(handleQuantityChange, 250);

  async function handleRemoveIngredient(ingredientId: string) {
    if (recipe.ingredientLines.length <= 1)
      return showErrorToast(
        'No se puede borrar, la receta debe tener al menos un ingrediente.',
      );

    try {
      await removeIngredientFromRecipe(recipe.id, ingredientId);
    } catch {
      showErrorToast('Error al eliminar el ingrediente.');
    }
  }

  function handleQuantityChange(lineId: string, quantity: number) {
    updateIngredientLineQuantity('recipe', recipe.id, lineId, quantity);
  }

  async function handleAddIngredients(e: React.FormEvent) {
    e.preventDefault();
    setIsAddingIngredients(true);
    setIsLoading(true);

    try {
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
    } catch {
      showErrorToast(
        'Error al añadir ingredientes. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsAddingIngredients(false);
      setIsLoading(false);
    }

    setNewIngredientLinesWithExternalRefs([]);
  }

  async function handleDuplicateRecipe() {
    setIsLoading(true);
    setIsDuplicatingRecipe(true);

    try {
      await duplicateRecipe(recipe.id);
    } catch (error) {
      if (isNextRedirectError(error)) return;

      showErrorToast(
        'Error al duplicar la receta. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsDuplicatingRecipe(false);
      setIsLoading(false);
    }
  }

  async function handleDeleteRecipe() {
    setIsLoading(true);
    setIsDeletingRecipe(true);

    try {
      await deleteRecipe(recipe.id);
    } catch (error) {
      if (isNextRedirectError(error)) return;

      showErrorToast(
        'Error al eliminar la receta. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsDeletingRecipe(false);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Modal>
        <SectionHeading>
          <h2>Ingredientes</h2>
        </SectionHeading>

        <div className="flex gap-4 mb-6">
          <Modal.Open opens="add-ingredient-modal">
            <ButtonNew
              disabled={buttonsDisabled}
              data-testid="add-ingredient-modal-button"
              isLoading={isAddingIngredients}
            >
              Añadir ingredientes
            </ButtonNew>
          </Modal.Open>

          <ButtonPrimary
            className="flex items-center gap-2"
            data-testid="duplicate-recipe-button"
            onClick={handleDuplicateRecipe}
            disabled={buttonsDisabled}
          >
            {isDuplicatingRecipe && <SpinnerMini />}
            {!isDuplicatingRecipe && <HiOutlineDuplicate />}
            <span>Duplicar receta</span>
          </ButtonPrimary>

          <ButtonPrimary
            className="flex items-center gap-2 border-error! text-error! hover:bg-error! hover:text-text-light! hover:border-error! disabled:border-text-minor-emphasis! disabled:hover:bg-transparent! disabled:text-text-minor-emphasis!"
            data-testid="delete-recipe-button"
            onClick={handleDeleteRecipe}
            disabled={buttonsDisabled}
          >
            {isDeletingRecipe && <SpinnerMini />}
            {!isDeletingRecipe && <HiOutlineTrash />}
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
            isLoading={isLoading}
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
  isLoading,
}: {
  setNewIngredientLinesWithExternalRefs: React.Dispatch<
    React.SetStateAction<IngredientLineWithExternalRef[]>
  >;
  newIngredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  isLoading: boolean;
  handleAddIngredients: (e: React.FormEvent) => Promise<void>;
  onCloseModal?: () => void;
}) {
  async function addIngredients(e: React.FormEvent) {
    await handleAddIngredients(e);
    onCloseModal?.();
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
        isLoading={isLoading}
      >
        Añadir
      </ButtonNew>
    </form>
  );
}
