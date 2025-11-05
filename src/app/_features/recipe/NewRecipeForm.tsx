'use client';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import IngredientLineItem from '../ingredient/IngredientLineItem';

import Input from '@/app/_ui/Input';
import Form from '@/app/_ui/NewResourceForm';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import VerticalList from '@/app/_ui/VerticalList';
import { useFormSetup, useResetOnSuccess } from '@/app/_utils/form/hooks';
import { useDebounce } from '@/app/hooks/useDebounce';
import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import { IngredientLineInfo } from '@/application-layer/use-cases/recipe/CreateRecipe/CreateRecipe.usecase';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import IngredientItemMini from '../ingredient/IngredientItemMini';
import { createRecipe } from './actions';
import ImagePicker from '@/app/_ui/ImagePicker';

function NewRecipeForm() {
  // Form state and action
  const { formRef, pending, startTransition, formState, formAction } =
    useFormSetup(createRecipe);

  // Business logic state
  const defaultRecipeName = 'Nueva receta';
  const [recipeName, setRecipeName] = useState(defaultRecipeName);

  const defaultIngredientSearchTerm = '';
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState(
    defaultIngredientSearchTerm
  );

  const defaultIngredients: IngredientDTO[] = [];
  const [ingredients, setIngredients] =
    useState<IngredientDTO[]>(defaultIngredients);

  const defaultIngredientLines: IngredientLineDTO[] = [];
  const [ingredientLines, setIngredientLines] = useState<IngredientLineDTO[]>(
    defaultIngredientLines
  );

  const totalCalories = Math.round(
    ingredientLines.reduce(
      (sum, il) => sum + (il.calories * il.quantityInGrams) / 100,
      0
    )
  );

  const totalProtein = Math.round(
    ingredientLines.reduce(
      (sum, il) => sum + (il.protein * il.quantityInGrams) / 100,
      0
    )
  );

  const debouncedFetchIngredients = useDebounce(fetchIngredients, 200);

  useEffect(() => {
    debouncedFetchIngredients(ingredientSearchTerm);
  }, [ingredientSearchTerm, debouncedFetchIngredients]);

  useResetOnSuccess(formRef, formState, pending, [
    { setter: setRecipeName, initialValue: defaultRecipeName },
    {
      setter: setIngredientSearchTerm,
      initialValue: defaultIngredientSearchTerm,
    },
    { setter: setIngredients, initialValue: defaultIngredients },
    { setter: setIngredientLines, initialValue: defaultIngredientLines },
  ]);

  async function fetchIngredients(term: string = ''): Promise<void> {
    const fetchedIngredients = await fetch(`/api/ingredient/fuzzy/${term}`);

    try {
      const data = await fetchedIngredients.json();
      setIngredients(data);
    } catch {
      setIngredients([]);
    }
  }

  async function selectIngredient(ingredient: IngredientDTO) {
    // Check if ingredient is already selected
    const exists = ingredientLines.find(
      (iq) => iq.ingredient.id === ingredient.id
    );

    if (exists)
      setIngredientLines((prev) =>
        prev.filter((iq) => iq.ingredient.id !== ingredient.id)
      );
    else {
      const ingredientLine: IngredientLineDTO = {
        id: 'temp-id-' + ingredient.id,
        ingredient: ingredient,
        quantityInGrams: 100,
        calories: Number(ingredient.nutritionalInfoPer100g.calories) || 1,
        protein: Number(ingredient.nutritionalInfoPer100g.protein) || 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setIngredientLines((prev) => [...prev, ingredientLine]);
    }
  }

  function handleIngredientLineQuantityChange(ingredientLineId: string) {
    return (newQuantity: number) => {
      setIngredientLines((prev) =>
        prev.map((il) =>
          il.id === ingredientLineId
            ? { ...il, quantityInGrams: newQuantity }
            : il
        )
      );
    };
  }

  function handleIngredientLineRemove(ingredientLineId: string) {
    setIngredientLines((prev) =>
      prev.filter((il) => il.id !== ingredientLineId)
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('userId', 'dev-user'); // TODO IMPORTANT: Replace with actual user ID
    formData.append('name', recipeName);

    const ingredientLinesInfo: IngredientLineInfo[] = ingredientLines.map(
      (il) => ({
        ingredientId: il.ingredient.id,
        quantityInGrams: il.quantityInGrams,
      })
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
      onSubmit={handleSubmit}
      submitText="Crear receta"
    >
      <div className="relative flex flex-col items-center justify-center w-64 mx-auto mb-2 overflow-hidden rounded-2xl aspect-square">
        <textarea
          className="z-10 resize-none text-center text-3xl text-zinc-700 font-extrabold w-[90%] outline-none overflow-x-hidden max-h-[90%]"
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
          src="/recipe-no-picture.png"
          alt="Imagen de la receta"
          fill
          className="object-contain"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/60 via-green-300/30 to-transparent" />

        <ImagePicker />
      </div>

      <Form.FormRow label="">
        <Input
          value={ingredientSearchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setIngredientSearchTerm(e.target.value)
          }
          placeholder="Buscar ingredientes..."
        />

        {ingredients.length > 0 && ingredientSearchTerm && (
          <VerticalList className="mx-auto max-w-80">
            {ingredients.map((ingredient) => (
              <IngredientItemMini
                key={ingredient.id}
                ingredient={ingredient}
                isSelected={
                  !!ingredientLines.find(
                    (iq) => iq.ingredient.id === ingredient.id
                  )
                }
                onClick={() => selectIngredient(ingredient)}
              />
            ))}
          </VerticalList>
        )}
      </Form.FormRow>

      <Form.FormRow label="" error={formState.errors.ingredientLines}>
        {ingredientLines.length ? ingredientLines.length : ''} Ingrediente
        {ingredientLines.length === 1 ? '' : 's'}
        {ingredientLines.map((ingredientLine) => (
          <IngredientLineItem
            key={ingredientLine.id}
            ingredientLine={ingredientLine}
            onQuantityChange={handleIngredientLineQuantityChange(
              ingredientLine.id
            )}
            onRemove={() => handleIngredientLineRemove(ingredientLine.id)}
          />
        ))}
      </Form.FormRow>

      {/* Summary */}
      {ingredientLines.length > 0 && (
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
