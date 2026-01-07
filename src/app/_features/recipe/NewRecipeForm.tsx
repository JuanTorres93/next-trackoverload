'use client';

import ImagePicker from '@/app/_ui/ImagePicker';
import Form from '@/app/_ui/NewResourceForm';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import { useFormSetup, useResetOnSuccess } from '@/app/_utils/form/hooks';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { IngredientLineInfo } from '@/application-layer/use-cases/recipe/CreateRecipe/CreateRecipe.usecase';
import Image from 'next/image';
import { useState } from 'react';
import { createRecipe } from './actions';
import IngredientSearch, {
  handleIngredientSelection,
  IngredientLineWithExternalRef,
} from './IngredientSearch';

function NewRecipeForm() {
  // Form state and action
  const { formRef, pending, startTransition, formState, formAction } =
    useFormSetup(createRecipe);

  // Business logic state
  const defaultRecipeName = 'Nueva receta';
  const [recipeName, setRecipeName] = useState(defaultRecipeName);

  const defaultIngredientLines: IngredientLineWithExternalRef[] = [];
  const [ingredientLinesWithExternalRefs, setIngredientLinesWithExternalRefs] =
    useState<IngredientLineWithExternalRef[]>(defaultIngredientLines);

  const defaultSelectedImage: File | null = null;
  const [selectedImage, setSelectedImage] = useState<File | null>(
    defaultSelectedImage
  );

  const totalCalories = formatToInteger(
    ingredientLinesWithExternalRefs.reduce(
      (sum, ingLineWithExternalRef) =>
        sum + ingLineWithExternalRef.ingredientLine.calories,
      0
    )
  );

  const totalProtein = formatToInteger(
    ingredientLinesWithExternalRefs.reduce(
      (sum, ingLineWithExternalRef) =>
        sum + ingLineWithExternalRef.ingredientLine.protein,
      0
    )
  );

  const invalidForm =
    ingredientLinesWithExternalRefs.length === 0 ||
    recipeName.trim() === '' ||
    ingredientLinesWithExternalRefs.some(
      (ingLineWithExternalRef) =>
        ingLineWithExternalRef.ingredientLine.quantityInGrams <= 0
    );

  useResetOnSuccess(formRef, formState, pending, [
    { setter: setRecipeName, initialValue: defaultRecipeName },
    {
      setter: setIngredientLinesWithExternalRefs,
      initialValue: defaultIngredientLines,
    },
    { setter: setSelectedImage, initialValue: defaultSelectedImage },
  ]);

  function handleImageSelection(files: File[]) {
    if (files.length > 0) {
      setSelectedImage(files[0]);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('userId', 'dev-user'); // TODO IMPORTANT: Replace with actual user ID
    formData.append('name', recipeName);

    // append image file if exists
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    const ingredientLinesInfo: IngredientLineInfo[] =
      ingredientLinesWithExternalRefs.map(
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
        }
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
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Nombre receta"
          onInput={(e) => {
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          required
        ></textarea>
        <Image
          src={
            selectedImage
              ? URL.createObjectURL(selectedImage)
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
                setIngredientLinesWithExternalRefs
              )
            }
          />
        </Form.FormRow>

        <Form.FormRow label="" error={formState?.errors.ingredientLines}>
          <IngredientSearch.SelectedIngredientsList
            ingredientLinesWithExternalRefs={ingredientLinesWithExternalRefs}
            setIngredientLinesWithExternalRefs={
              setIngredientLinesWithExternalRefs
            }
          />
        </Form.FormRow>
      </IngredientSearch>

      {/* Summary */}
      {ingredientLinesWithExternalRefs.length > 0 && (
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
