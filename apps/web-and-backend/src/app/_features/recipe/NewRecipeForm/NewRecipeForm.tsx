"use client";

import { CreateIngredientLineData } from "shared";

import { AppClientImageProcessor } from "../../../../interface-adapters/app/services/AppClientImageProcessor";
import { useFormSetup } from "../../../_hooks/useFormSetup";
import { showErrorToast } from "../../../_ui/showErrorToast";
import { isNextRedirectError } from "../../common/handleNextRedirectError";
import IngredientSearch, {
  IngredientLineWithExternalRef,
} from "../../ingredient/IngredientSearch";
import { createRecipe } from "../actions";
import IngredientsPanel from "./IngredientsPanel";
import RecipePreviewCard from "./RecipePreviewCard";

export type NewRecipeFormState = {
  name: string;
  ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  imageFile: File | undefined;
};

const INITIAL_FORM_STATE: NewRecipeFormState = {
  name: "",
  ingredientLinesWithExternalRefs: [],
  imageFile: undefined,
};

function NewRecipeForm() {
  const { formState, setField, isLoading, resetForm, setIsLoading } =
    useFormSetup<NewRecipeFormState>(INITIAL_FORM_STATE);

  function onIngredientSelection(
    ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[],
  ) {
    setField(
      "ingredientLinesWithExternalRefs",
      ingredientLinesWithExternalRefs,
    );
  }

  const hasIngredients = formState.ingredientLinesWithExternalRefs.length > 0;

  const invalidForm =
    !hasIngredients ||
    formState.name.trim() === "" ||
    formState.ingredientLinesWithExternalRefs.some(
      (il) => il.ingredientLine.quantityInGrams <= 0,
    ) ||
    isLoading;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    const ingredientLinesInfo: CreateIngredientLineData[] =
      computeIngredientLinesInfo(formState);

    let compressedImageFile: File | undefined;

    try {
      if (formState.imageFile) {
        compressedImageFile = await AppClientImageProcessor.compressToMaxMB(
          formState.imageFile,
        );
      }

      const jsend = await createRecipe({
        name: formState.name,
        imageFile: compressedImageFile,
        ingredientLinesInfo,
      });

      if (jsend.status !== "success") {
        showErrorToast(
          jsend.data?.message ||
            "Error al crear la receta. Intenta nuevamente.",
        );
        return;
      }

      resetForm();
    } catch (error) {
      if (isNextRedirectError(error)) return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <IngredientSearch onIngredientSelection={onIngredientSelection}>
      <form
        onSubmit={handleSubmit}
        className="flex items-start w-full max-w-4xl gap-6 max-bp-new-recipe-page:flex-col max-bp-new-recipe-page:gap-5 max-bp-new-recipe-page:max-w-2xl"
      >
        <IngredientsPanel
          isLoading={isLoading}
          hasIngredients={hasIngredients}
        />

        <RecipePreviewCard
          isLoading={isLoading}
          hasIngredients={hasIngredients}
          setField={setField}
          formState={formState}
          invalidForm={invalidForm}
        />
      </form>
    </IngredientSearch>
  );
}

function computeIngredientLinesInfo(
  formState: NewRecipeFormState,
): CreateIngredientLineData[] {
  const ingredientLinesInfo: CreateIngredientLineData[] =
    formState.ingredientLinesWithExternalRefs.map((info) => {
      const { ingredientLine, ingredientExternalRef: externalRef } = info;

      return {
        externalIngredientId: externalRef.externalId,
        source: externalRef.source,
        name: ingredientLine.ingredient.name,
        caloriesPer100g:
          ingredientLine.ingredient.nutritionalInfoPer100g.calories,
        proteinPer100g:
          ingredientLine.ingredient.nutritionalInfoPer100g.protein,
        imageUrl: ingredientLine.ingredient.imageUrl,
        quantityInGrams: ingredientLine.quantityInGrams,
      };
    });

  return ingredientLinesInfo;
}

export default NewRecipeForm;
