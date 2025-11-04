'use client';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import IngredientLineItem from '../ingredient/IngredientLineItem';

import { useEffect, useState } from 'react';
import Form from '@/app/_ui/NewResourceForm';
import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import Input from '@/app/_ui/Input';
import { useDebounce } from '@/app/hooks/useDebounce';
import IngredientItemMini from '../ingredient/IngredientItemMini';
import VerticalList from '@/app/_ui/VerticalList';
import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import Image from 'next/image';

function NewRecipeForm() {
  const [recipeName, setRecipeName] = useState('Nueva receta');
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
  const [ingredientLines, setIngredientLines] = useState<IngredientLineDTO[]>(
    []
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

  return (
    <Form submitText="Crear receta">
      <header className="relative flex items-center justify-center w-64 mx-auto mb-2 overflow-hidden rounded-2xl aspect-square">
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
        ></textarea>
        <Image
          src="/recipe-no-picture.png"
          alt="Imagen de la receta"
          fill
          className="object-contain"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/60 via-green-300/30 to-transparent" />
      </header>

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

      <Form.FormRow label="">
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
