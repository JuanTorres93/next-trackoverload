"use client";

import Image from "next/image";

import { HiSearch } from "react-icons/hi";

import { useFormSetup } from "@/app/_hooks/useFormSetup";
import ImagePicker from "@/app/_ui/ImagePicker";
import ButtonNew from "@/app/_ui/buttons/ButtonNew";
import { showErrorToast } from "@/app/_ui/showErrorToast";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";
import { CreateIngredientLineData } from "@/application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo";
import { AppClientImageProcessor } from "@/interface-adapters/app/services/AppClientImageProcessor";

import LoadingOverlay from "../common/LoadingOverlay";
import { isNextRedirectError } from "../common/handleNextRedirectError";
import ArrangedIngredientSearch from "../ingredient/ArrangedIngredientSearch";
import IngredientSearch, {
  IngredientLineWithExternalRef,
} from "../ingredient/IngredientSearch";
import { createRecipe } from "./actions";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const ingredientLinesInfo: CreateIngredientLineData[] =
      computeIngredientLinesInfo(formState);

    let compressedImageFile: File | undefined;
    if (formState.imageFile) {
      compressedImageFile = await AppClientImageProcessor.compressToMaxMB(
        formState.imageFile,
      );
    }

    try {
      await createRecipe({
        name: formState.name,
        imageFile: compressedImageFile,
        ingredientLinesInfo,
      });

      resetForm();
    } catch (error) {
      if (isNextRedirectError(error)) return;

      showErrorToast(
        "Error al crear la receta. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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

function IngredientsPanel({
  isLoading,
  hasIngredients,
}: {
  isLoading: boolean;
  hasIngredients: boolean;
}) {
  return (
    <div className="flex flex-col flex-1 min-w-0 gap-5">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-text">Nueva receta</h1>

        <p className="text-sm text-text-minor-emphasis">
          Busca ingredientes y ajusta las cantidades
        </p>
      </div>

      <ArrangedIngredientSearch isLoading={isLoading} />

      <IngredientSearch.FoundIngredientsList />

      {hasIngredients && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/30" />

          <p className="text-xs font-semibold tracking-wide uppercase text-text-minor-emphasis">
            Ingredientes añadidos
          </p>
          <div className="flex-1 h-px bg-border/30" />
        </div>
      )}

      {!hasIngredients && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-text-minor-emphasis/50">
          <HiSearch className="text-4xl" />

          <div className="text-center">
            <p className="text-sm font-semibold">Sin ingredientes todavía</p>

            <p className="mt-1 text-xs">
              Busca arriba y selecciona los ingredientes de tu receta
            </p>
          </div>
        </div>
      )}

      <IngredientSearch.SelectedIngredientsList
        showIngredientLabel={false}
        hideEmptyState
      />
    </div>
  );
}

function RecipePreviewCard({
  isLoading,
  hasIngredients,
  setField,
  formState,
  invalidForm,
}: {
  isLoading: boolean;
  hasIngredients: boolean;
  setField: (
    fieldName: keyof NewRecipeFormState,
    value: NewRecipeFormState[keyof NewRecipeFormState],
  ) => void;
  formState: NewRecipeFormState;
  invalidForm: boolean;
}) {
  const totalCalories = formatToInteger(
    formState.ingredientLinesWithExternalRefs.reduce(
      (sum, il) => sum + il.ingredientLine.calories,
      0,
    ),
  );
  const totalProtein = formatToInteger(
    formState.ingredientLinesWithExternalRefs.reduce(
      (sum, il) => sum + il.ingredientLine.protein,
      0,
    ),
  );

  const imagePreviewUrl = formState.imageFile
    ? URL.createObjectURL(formState.imageFile)
    : "/recipe-no-picture.webp";

  function handleImageSelection(files: File[]) {
    if (files.length > 0) setField("imageFile", files[0]);
  }

  return (
    <aside className="sticky w-64 shrink-0 top-6 max-bp-new-recipe-page:w-full max-bp-new-recipe-page:static max-bp-new-recipe-page:order-first">
      <div className="relative overflow-hidden border shadow-sm rounded-2xl border-border/60 bg-surface-card">
        {isLoading && <LoadingOverlay className="z-20 rounded-2xl" />}

        {/* Recipe image */}
        <div className="relative h-44 bg-surface-light">
          <Image
            src={imagePreviewUrl}
            alt="Imagen de la receta"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-overlay/60 via-transparent to-transparent" />

          <div className="absolute z-10 bottom-3 left-3 right-3">
            <ImagePicker
              compact
              onFiles={handleImageSelection}
              maxSizeMB={200}
              accept="image/jpeg,image/png,image/webp"
            />
          </div>
        </div>

        {/* Recipe name */}
        <div className="px-4 pt-3 pb-2 border-b border-border/30">
          <textarea
            data-testid="recipe-name-input"
            className="w-full text-lg font-bold leading-snug bg-transparent outline-none resize-none text-text placeholder:text-text-minor-emphasis"
            rows={2}
            spellCheck={false}
            value={formState.name}
            disabled={isLoading}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Nombre de la receta"
            required
          />
        </div>

        {/* Macro totals */}
        {hasIngredients ? (
          <div className="flex items-center px-4 py-3 border-b bg-surface-light border-border/30">
            <MacroStat value={totalCalories} label="calorías totales" />

            <div className="w-px h-6 mx-2 bg-border/40" />

            <MacroStat value={totalProtein} label="proteínas totales" />
          </div>
        ) : (
          <div className="px-4 py-3 text-xs italic border-b text-text-minor-emphasis/60 border-border/30">
            Añade ingredientes para ver las macros
          </div>
        )}

        {/* Submit */}
        <div className="px-4 py-3">
          <ButtonNew
            className="justify-center w-full"
            disabled={invalidForm}
            isLoading={isLoading}
          >
            Crear receta
          </ButtonNew>
        </div>
      </div>
    </aside>
  );
}

function MacroStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center flex-1">
      <span className="text-lg font-bold leading-none text-text">{value}</span>
      <span className="text-xs text-text-minor-emphasis mt-0.5">{label}</span>
    </div>
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
