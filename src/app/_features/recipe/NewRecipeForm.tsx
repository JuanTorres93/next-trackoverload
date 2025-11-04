'use client';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import IngredientLineItem from '../ingredient/IngredientLineItem';

import { useEffect, useState } from 'react';
import Form from '@/app/_ui/NewResourceForm';
import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import Input from '@/app/_ui/Input';
import { useDebounce } from '@/app/hooks/useDebounce';
import IngredientItemMini from '../ingredient/IngredientItemMini';

function NewRecipeForm() {
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
  const [ingredientLines, setIngredientLines] = useState<IngredientLineDTO[]>(
    []
  );

  const debouncedFetchIngredients = useDebounce(fetchIngredients, 300);

  useEffect(() => {
    debouncedFetchIngredients(ingredientSearchTerm);
  }, [ingredientSearchTerm, debouncedFetchIngredients]);

  async function fetchIngredients(term: string = ''): Promise<void> {
    const fetchedIngredients = await fetch(`/api/ingredient/fuzzy/${term}`);

    try {
      const data = await fetchedIngredients.json();
      setIngredients(data);
    } catch (error) {
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

  function onIngredientLineQuantityChange(ingredientLineId: string) {
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

  return (
    <Form submitText="Crear receta">
      <Form.FormRow label="">
        <Input
          value={ingredientSearchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setIngredientSearchTerm(e.target.value)
          }
          placeholder="Buscar ingredientes..."
        />
      </Form.FormRow>

      {ingredients.map((ingredient) => (
        <IngredientItemMini
          key={ingredient.id}
          ingredient={ingredient}
          isSelected={
            !!ingredientLines.find((iq) => iq.ingredient.id === ingredient.id)
          }
          onClick={() => selectIngredient(ingredient)}
        />
      ))}

      <Form.FormRow label="">
        {ingredientLines.length ? ingredientLines.length : ''} Ingrediente
        {ingredientLines.length === 1 ? '' : 's'}
        {ingredientLines.map((ingredientLine) => (
          <IngredientLineItem
            key={ingredientLine.id}
            ingredientLine={ingredientLine}
            onQuantityChange={onIngredientLineQuantityChange(ingredientLine.id)}
          />
        ))}
      </Form.FormRow>
    </Form>
  );
}

export default NewRecipeForm;
