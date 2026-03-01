'use client';

import { useFormSetup } from '@/app/_hooks/useFormSetup';
import ButtonNew from '@/app/_ui/ButtonNew';
import FormRow from '@/app/_ui/form/FormRow';
import ImagePicker from '@/app/_ui/ImagePicker';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { CreateIngredientLineData } from '@/application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';
import Image from 'next/image';
import IngredientSearch, {
  IngredientLineWithExternalRef,
} from '../ingredient/IngredientSearch';
import { createRecipe } from './actions';

import { AppClientImageProcessor } from '@/interface-adapters/app/services/AppClientImageProcessor';
import LoadingOverlay from '../common/LoadingOverlay';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import { isNextRedirectError } from '../common/handleNextRedirectError';

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

    setIsLoading(true);

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
      compressedImageFile = await AppClientImageProcessor.compressToMaxMB(
        formState.imageFile,
      );
    }

    try {
      await createRecipe({
        name: formState.name,
        imageFile: compressedImageFile,
        ingredientLinesInfo: ingredientLinesInfo,
      });

      resetForm();
    } catch (error) {
      if (isNextRedirectError(error)) return;

      showErrorToast(
        'Error al crear la receta. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IngredientSearch onIngredientSelection={onIngredientSelection}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center max-w-2xl gap-4"
      >
        <FormRow>
          <div
            id="image-and-name-container"
            className="relative flex flex-col items-center justify-center p-4 mx-auto mb-2 overflow-hidden w-80 text-text-light rounded-2xl aspect-square"
          >
            {isLoading && (
              <LoadingOverlay className="bg-surface-dark/20! backdrop-blur-sm z-14!" />
            )}
            <textarea
              className="z-15 resize-none text-center text-3xl  font-extrabold w-[90%] outline-none overflow-x-hidden max-h-[90%]"
              spellCheck={false}
              value={formState.name}
              disabled={isLoading}
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
              maxSizeMB={200} // Image is compressed on submit, so we can allow bigger sizes
              borderTailwindColor="gray"
              accept="image/jpeg,image/png,image/webp"
            />
          </div>
        </FormRow>

        <FormRow className="flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-4">
            <IngredientSearch.Search
              className="w-full max-w-120"
              disabled={isLoading}
            />
            <IngredientSearch.BarcodeSearch disabled={isLoading} />
          </div>

          <IngredientSearch.FoundIngredientsList containerClassName="max-w-120" />
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

          <ButtonNew
            className="flex items-center justify-center w-full mt-6"
            disabled={invalidForm}
            isLoading={isLoading}
          >
            Crear receta
          </ButtonNew>
        </FormRow>
      </form>
    </IngredientSearch>
  );
}

export default NewRecipeForm;
