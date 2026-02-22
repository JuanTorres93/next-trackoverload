'use client';

import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonNew from '@/app/_ui/ButtonNew';
import FormRow from '@/app/_ui/form/FormRow';
import ImagePicker from '@/app/_ui/ImagePicker';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { CreateIngredientLineData } from '@/application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';
import Image from 'next/image';
import { useState } from 'react';
import IngredientSearch, {
  IngredientLineWithExternalRef,
} from '../ingredient/IngredientSearch';
import { createRecipe } from './actions';

import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { AppClientImageProcessor } from '@/interface-adapters/app/services/AppClientImageProcessor';
import IngredientBarcodeSearch from '../ingredient/IngredientBarcodeSearch';
import IngredientItemMini from '../ingredient/IngredientItemMini';
import { ingredientFinderResultToIngredientLineWithExternalRef } from '../ingredient/IngredientSearch';

export type NewRecipeFormState = {
  name: string;
  ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  imageFile: File | undefined;
};

const INITIAL_FORM_STATE: NewRecipeFormState = {
  name: 'Nueva receta',
  ingredientLinesWithExternalRefs: [],
  imageFile: undefined,
};

function NewRecipeForm() {
  const { formState, setField, isLoading, resetForm, setIsLoading } =
    useFormSetup<NewRecipeFormState>(INITIAL_FORM_STATE);

  const [foundCodebarIngredient, setFoundCodebarIngredient] =
    useState<IngredientLineWithExternalRef | null>(null);

  function onIngredientSelection(
    ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[],
  ) {
    setField(
      'ingredientLinesWithExternalRefs',
      ingredientLinesWithExternalRefs,
    );
  }

  const invalidForm =
    formState.ingredientLinesWithExternalRefs.length === 0 ||
    formState.name.trim() === '' ||
    formState.ingredientLinesWithExternalRefs.some(
      (ingLineWithExternalRef) =>
        ingLineWithExternalRef.ingredientLine.quantityInGrams <= 0,
    ) ||
    isLoading;

  const totalCalories = formatToInteger(
    formState.ingredientLinesWithExternalRefs.reduce(
      (sum, ingLineWithExternalRef) =>
        sum + ingLineWithExternalRef.ingredientLine.calories,
      0,
    ),
  );

  const totalProtein = formatToInteger(
    formState.ingredientLinesWithExternalRefs.reduce(
      (sum, ingLineWithExternalRef) =>
        sum + ingLineWithExternalRef.ingredientLine.protein,
      0,
    ),
  );

  function handleImageSelection(files: File[]) {
    if (files.length > 0) {
      setField('imageFile', files[0]);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ingredientLinesInfo: CreateIngredientLineData[] =
      formState.ingredientLinesWithExternalRefs.map(
        (info: IngredientLineWithExternalRef) => {
          const ingredientLine = info.ingredientLine;
          const externalRef = info.ingredientExternalRef;

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
        },
      );

    let compressedImageFile: File | undefined = undefined;
    if (formState.imageFile) {
      setIsLoading(true);
      compressedImageFile = await AppClientImageProcessor.compressToMaxMB(
        formState.imageFile,
      );
    }

    try {
      await createRecipe({
        userId: 'dev-user', // TODO IMPORTANT: Replace with actual user ID
        name: formState.name,
        imageFile: compressedImageFile,
        ingredientLinesInfo: ingredientLinesInfo,
      });
      resetForm();
    } finally {
      setIsLoading(false);
    }
  };

  function onBarcodeIngredientFound(
    ingredientFinderResult: IngredientFinderResult,
  ) {
    const ingredientLineWithExternalRef =
      ingredientFinderResultToIngredientLineWithExternalRef(
        ingredientFinderResult,
      );
    setFoundCodebarIngredient(ingredientLineWithExternalRef);
  }

  function onBarcodeIngredientNotFound() {
    setFoundCodebarIngredient(null);
  }

  return (
    <IngredientSearch onIngredientSelection={onIngredientSelection}>
      <div className="m-6">
        <IngredientBarcodeSearch
          onIngredientFound={onBarcodeIngredientFound}
          onIngredientNotFound={onBarcodeIngredientNotFound}
        />

        {foundCodebarIngredient && (
          <IngredientItemMini
            ingredient={foundCodebarIngredient.ingredientLine.ingredient}
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <FormRow className="grid items-start justify-center grid-cols-2 gap-8">
          <div
            id="image-and-name-container"
            className="relative flex flex-col items-center justify-center p-4 mx-auto mb-2 overflow-hidden w-80 text-text-light rounded-2xl aspect-square"
          >
            <textarea
              className="z-10 resize-none text-center text-3xl  font-extrabold w-[90%] outline-none overflow-x-hidden max-h-[90%]"
              spellCheck={false}
              value={formState.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Nombre receta"
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              required
            ></textarea>
            <Image
              src={
                formState.imageFile
                  ? URL.createObjectURL(formState.imageFile)
                  : '/recipe-no-picture.png'
              }
              alt="Imagen de la receta"
              fill
              // className="object-contain"
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-overlay/60" />

            <ImagePicker
              onFiles={handleImageSelection}
              maxSizeMB={2}
              borderTailwindColor="gray"
              accept="image/jpeg,image/png,image/webp"
            />
          </div>

          <FormRow className="flex-col items-center gap-6">
            <IngredientSearch.Search className="w-full max-w-120" />

            <IngredientSearch.FoundIngredientsList containerClassName="max-w-120" />
          </FormRow>
        </FormRow>

        <FormRow className="flex-col items-center justify-center mx-auto max-w-150">
          <IngredientSearch.SelectedIngredientsList />

          {/* Summary */}
          {formState.ingredientLinesWithExternalRefs.length > 0 && (
            <div className="grid w-full grid-cols-2 p-3 mt-4 rounded-lg bg-surface-dark ">
              <NutritionalInfoValue
                lightText={true}
                number={totalCalories}
                label="Calorías totales"
              />
              <NutritionalInfoValue
                lightText={true}
                number={totalProtein}
                label="Proteínas totales"
              />
            </div>
          )}

          <ButtonNew className="w-full mt-6" disabled={invalidForm}>
            Crear receta
          </ButtonNew>
        </FormRow>
      </form>
    </IngredientSearch>
  );
}

export default NewRecipeForm;
