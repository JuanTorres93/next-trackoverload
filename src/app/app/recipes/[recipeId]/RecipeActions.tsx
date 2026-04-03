"use client";

import { useState } from "react";

import { HiOutlineDuplicate, HiOutlineTrash } from "react-icons/hi";

import { isNextRedirectError } from "@/app/_features/common/handleNextRedirectError";
import ArrangedIngredientSearch from "@/app/_features/ingredient/ArrangedIngredientSearch";
import IngredientLineItem from "@/app/_features/ingredient/IngredientLineItem";
import IngredientSearch, {
  IngredientLineWithExternalRef,
} from "@/app/_features/ingredient/IngredientSearch";
import { updateIngredientLineQuantity } from "@/app/_features/ingredient/actions";
import {
  addIngredientToRecipe,
  deleteRecipe,
  duplicateRecipe,
  removeIngredientFromRecipe,
} from "@/app/_features/recipe/actions";
import { useDebounce } from "@/app/_hooks/useDebounce";
import ConfirmDelete from "@/app/_ui/ConfirmDeleteModal";
import GridAutoCols from "@/app/_ui/GridAutoCols";
import Modal from "@/app/_ui/Modal";
import SpinnerMini from "@/app/_ui/SpinnerMini";
import ButtonDanger from "@/app/_ui/buttons/ButtonDanger";
import ButtonNew from "@/app/_ui/buttons/ButtonNew";
import ButtonPrimary from "@/app/_ui/buttons/ButtonPrimary";
import { showErrorToast } from "@/app/_ui/showErrorToast";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";

export default function RecipeActions({ recipe }: { recipe: RecipeDTO }) {
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
        "No se puede borrar, la receta debe tener al menos un ingrediente.",
      );

    try {
      await removeIngredientFromRecipe(recipe.id, ingredientId);
    } catch {
      showErrorToast("Error al eliminar el ingrediente.");
    }
  }

  function handleQuantityChange(lineId: string, quantity: number) {
    updateIngredientLineQuantity("recipe", recipe.id, lineId, quantity);
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
        "Error al añadir ingredientes. Por favor, inténtalo de nuevo.",
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
        "Error al duplicar la receta. Por favor, inténtalo de nuevo.",
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
        "Error al eliminar la receta. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsDeletingRecipe(false);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Modal>
        {/* ── Action buttons ──────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 max-bp-recipe-page:justify-center">
          <ButtonPrimary
            className="flex items-center gap-2 rounded-xl"
            data-testid="duplicate-recipe-button"
            onClick={handleDuplicateRecipe}
            disabled={buttonsDisabled}
          >
            {isDuplicatingRecipe ? <SpinnerMini /> : <HiOutlineDuplicate />}
            <span>Duplicar receta</span>
          </ButtonPrimary>

          <Modal.Open opens="confirm-delete-recipe-modal">
            <ButtonDanger
              className="rounded-xl"
              data-testid="delete-recipe-button"
              disabled={buttonsDisabled}
            >
              {isDeletingRecipe ? <SpinnerMini /> : <HiOutlineTrash />}
              <span>Eliminar receta</span>
            </ButtonDanger>
          </Modal.Open>
        </div>

        {/* ── Ingredients section ─────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Section header row */}
          <div className="flex items-center justify-between gap-4 max-bp-recipe-page-second:flex-col max-bp-recipe-page-second:items-start">
            <h2 className="text-2xl font-bold text-text">Ingredientes</h2>

            <Modal.Open opens="add-ingredient-modal">
              <ButtonNew
                disabled={buttonsDisabled}
                data-testid="add-ingredient-modal-button"
                isLoading={isAddingIngredients}
              >
                Añadir ingredientes
              </ButtonNew>
            </Modal.Open>
          </div>

          <GridAutoCols
            data-testid="ingredient-lines-container"
            className="gap-3 auto-rows-min"
            fitOrFill="fill"
            min="18rem"
            max="1fr"
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
          </GridAutoCols>
        </div>

        {/* ── Modals ──────────────────────────────────────────────────── */}
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

        <Modal.Window name="confirm-delete-recipe-modal">
          <ConfirmDelete
            onConfirm={handleDeleteRecipe}
            onCloseModal={() => {}}
            resourceName={recipe.name}
            resourceType="receta"
            disabled={buttonsDisabled}
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
        <ArrangedIngredientSearch isLoading={isLoading} />

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
          newIngredientLinesWithExternalRefs.length <= 0 ? "hidden" : ""
        }`}
        onClick={addIngredients}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Añadir
      </ButtonNew>
    </form>
  );
}
