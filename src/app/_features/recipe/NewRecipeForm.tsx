'use client';

import ImagePicker from '@/app/_ui/ImagePicker';
import Form from '@/app/_ui/NewResourceForm';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { useFormSetup } from '@/app/_utils/form/hooks';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { IngredientLineInfo } from '@/application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';
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
  imageBuffer: File | null;
};

type FormErrors = Record<keyof NewRecipeFormState, string>;

const INITIAL_FORM_STATE: NewRecipeFormState = {
  name: 'Nueva receta',
  ingredientLinesWithExternalRefs: [],
  imageBuffer: null,
};

function NewRecipeForm() {
  // Form state and action
  const { formRef, pending, startTransition, formState, formAction } =
    useFormSetup(createRecipe);

  const [formStateRefactoring, setFormStateRefactoring] =
    useState<NewRecipeFormState>(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState<FormErrors>({} as FormErrors);

  const [
    ingredientLinesWithExternalRefsIngredientComponent,
    setIngredientLinesWithExternalRefsIngredientComponent,
  ] = useState<IngredientLineWithExternalRef[]>([
    ...INITIAL_FORM_STATE.ingredientLinesWithExternalRefs,
  ]);

  useEffect(() => {
    setFormStateRefactoring((prev) => ({
      ...prev,
      ingredientLinesWithExternalRefs:
        ingredientLinesWithExternalRefsIngredientComponent,
    }));
  }, [ingredientLinesWithExternalRefsIngredientComponent]);

  const invalidForm =
    formStateRefactoring.ingredientLinesWithExternalRefs.length === 0 ||
    formStateRefactoring.name.trim() === '' ||
    formStateRefactoring.ingredientLinesWithExternalRefs.some(
      (ingLineWithExternalRef) =>
        ingLineWithExternalRef.ingredientLine.quantityInGrams <= 0,
    );

  function setField<FormKey extends keyof NewRecipeFormState>(
    key: FormKey,
    value: NewRecipeFormState[FormKey],
  ) {
    setFormStateRefactoring((prev) => ({ ...prev, [key]: value }));
  }

  const totalCalories = formatToInteger(
    formStateRefactoring.ingredientLinesWithExternalRefs.reduce(
      (sum, ingLineWithExternalRef) =>
        sum + ingLineWithExternalRef.ingredientLine.calories,
      0,
    ),
  );

  const totalProtein = formatToInteger(
    formStateRefactoring.ingredientLinesWithExternalRefs.reduce(
      (sum, ingLineWithExternalRef) =>
        sum + ingLineWithExternalRef.ingredientLine.protein,
      0,
    ),
  );

  function handleResetForm() {
    setFormStateRefactoring(INITIAL_FORM_STATE);
    setFormErrors({} as FormErrors);
  }

  function handleImageSelection(files: File[]) {
    if (files.length > 0) {
      setField('imageBuffer', files[0]);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('userId', 'dev-user'); // TODO IMPORTANT: Replace with actual user ID
    formData.append('name', formStateRefactoring.name);

    // append image file if exists
    if (formStateRefactoring.imageBuffer) {
      formData.append('image', formStateRefactoring.imageBuffer);
    }

    const ingredientLinesInfo: IngredientLineInfo[] =
      formStateRefactoring.ingredientLinesWithExternalRefs.map(
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

    formData.append('ingredientLinesInfo', JSON.stringify(ingredientLinesInfo));

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form
      ref={formRef}
      isPending={pending}
      disableSubmit={invalidForm}
      onSubmit={handleSubmit}
      submitText="Crear receta"
    >
      <div className="relative flex flex-col items-center justify-center w-64 mx-auto mb-2 overflow-hidden text-zinc-100 rounded-2xl aspect-square">
        <textarea
          className="z-10 resize-none text-center text-3xl  font-extrabold w-[90%] outline-none overflow-x-hidden max-h-[90%]"
          spellCheck={false}
          value={formStateRefactoring.name}
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
            formStateRefactoring.imageBuffer
              ? URL.createObjectURL(formStateRefactoring.imageBuffer)
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
        <Form.FormRow label="">
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
        </Form.FormRow>

        <Form.FormRow label="" error={formState?.errors.ingredientLines}>
          <IngredientSearch.SelectedIngredientsList
            ingredientLinesWithExternalRefs={
              formStateRefactoring.ingredientLinesWithExternalRefs
            }
            setIngredientLinesWithExternalRefs={
              setIngredientLinesWithExternalRefsIngredientComponent
            }
          />
        </Form.FormRow>
      </IngredientSearch>

      {/* Summary */}
      {formStateRefactoring.ingredientLinesWithExternalRefs.length > 0 && (
        <Form.FormRow label="">
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
        </Form.FormRow>
      )}
    </Form>
  );
}

export default NewRecipeForm;
