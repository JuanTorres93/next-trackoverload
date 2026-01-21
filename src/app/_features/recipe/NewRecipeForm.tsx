'use client';

import ButtonNew from '@/app/_ui/ButtonNew';
import FormRow from '@/app/_ui/form/FormRow';
import ImagePicker from '@/app/_ui/ImagePicker';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { CreateIngredientLineData } from '@/application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createRecipe } from './actions';
import IngredientSearch, {
  handleIngredientSelection,
  IngredientLineWithExternalRef,
} from './IngredientSearch';

export type NewRecipeFormState = {
  name: string;
  ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  imageBuffer: File | undefined;
};

type FormErrors = Record<keyof NewRecipeFormState, string>;

const INITIAL_FORM_STATE: NewRecipeFormState = {
  name: 'Nueva receta',
  ingredientLinesWithExternalRefs: [],
  imageBuffer: undefined,
};

function NewRecipeForm() {
  const [formState, setFormState] =
    useState<NewRecipeFormState>(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState<FormErrors>({} as FormErrors);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Separate state needed due to implementation of IngredientSearch component
  const [
    ingredientLinesWithExternalRefsIngredientComponent,
    setIngredientLinesWithExternalRefsIngredientComponent,
  ] = useState<IngredientLineWithExternalRef[]>([
    ...INITIAL_FORM_STATE.ingredientLinesWithExternalRefs,
  ]);

  // Sync ingredient lines with form state
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      ingredientLinesWithExternalRefs:
        ingredientLinesWithExternalRefsIngredientComponent,
    }));
  }, [ingredientLinesWithExternalRefsIngredientComponent]);

  const invalidForm =
    formState.ingredientLinesWithExternalRefs.length === 0 ||
    formState.name.trim() === '' ||
    formState.ingredientLinesWithExternalRefs.some(
      (ingLineWithExternalRef) =>
        ingLineWithExternalRef.ingredientLine.quantityInGrams <= 0,
    ) ||
    isLoading;

  function setField<FormKey extends keyof NewRecipeFormState>(
    key: FormKey,
    value: NewRecipeFormState[FormKey],
  ) {
    setFormState((prev) => ({ ...prev, [key]: value }));
  }

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

  function handleResetForm() {
    setFormState(INITIAL_FORM_STATE);
    setFormErrors({} as FormErrors);
  }

  function handleImageSelection(files: File[]) {
    if (files.length > 0) {
      setField('imageBuffer', files[0]);
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

    try {
      await createRecipe({
        userId: 'dev-user', // TODO IMPORTANT: Replace with actual user ID
        name: formState.name,
        image: formState.imageBuffer,
        ingredientLinesInfo: ingredientLinesInfo,
      });
      handleResetForm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative flex flex-col items-center justify-center w-64 mx-auto mb-2 overflow-hidden text-zinc-100 rounded-2xl aspect-square">
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
            formState.imageBuffer
              ? URL.createObjectURL(formState.imageBuffer)
              : '/recipe-no-picture.png'
          }
          alt="Imagen de la receta"
          fill
          // className="object-contain"
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-600/60" />

        <ImagePicker
          onFiles={handleImageSelection}
          maxSizeMB={2}
          borderTailwindColor="gray"
          accept="image/jpeg,image/png,image/webp"
        />
      </div>

      <IngredientSearch>
        <FormRow>
          <IngredientSearch.Search />

          <IngredientSearch.FoundIngredientsList
            onSelectFoundIngredient={(ingredientFinderResult, isSelected) =>
              handleIngredientSelection(
                ingredientFinderResult,
                isSelected,
                setIngredientLinesWithExternalRefsIngredientComponent,
              )
            }
          />
        </FormRow>

        <FormRow>
          <IngredientSearch.SelectedIngredientsList
            ingredientLinesWithExternalRefs={
              formState.ingredientLinesWithExternalRefs
            }
            setIngredientLinesWithExternalRefs={
              setIngredientLinesWithExternalRefsIngredientComponent
            }
          />
        </FormRow>
      </IngredientSearch>

      {/* Summary */}
      {formState.ingredientLinesWithExternalRefs.length > 0 && (
        <FormRow>
          <div className="grid p-3 rounded-lg grid-cols-2 mt-4 bg-neutral-500 **:text-zinc-50 ">
            <NutritionalInfoValue
              number={totalCalories}
              label="Calorías totales"
            />
            <NutritionalInfoValue
              number={totalProtein}
              label="Proteínas totales"
            />
          </div>
        </FormRow>
      )}

      <FormRow>
        <ButtonNew disabled={invalidForm}>Crear receta</ButtonNew>
      </FormRow>
    </form>
  );
}

export default NewRecipeForm;
