'use client';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import IngredientLineItem from '../ingredient/IngredientLineItem';

import { useEffect, useState } from 'react';
import Form from '@/app/_ui/NewResourceForm';
import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import Input from '@/app/_ui/Input';
import { useDebounce } from '@/app/hooks/useDebounce';
import IngredientItemMini from '../ingredient/IngredientItemMini';

type IngredientAndQuantity = {
  ingredient: IngredientDTO;
  quantityInGrams: number;
};

function NewRecipeForm() {
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState<IngredientDTO[]>([]);
  const [ingredientsAndQuantities, setIngredientsAndQuantities] = useState<
    IngredientAndQuantity[]
  >([]);

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
    const exists = ingredientsAndQuantities.find(
      (iq) => iq.ingredient.id === ingredient.id
    );

    if (exists)
      setIngredientsAndQuantities((prev) =>
        prev.filter((iq) => iq.ingredient.id !== ingredient.id)
      );
    else
      setIngredientsAndQuantities((prev) => [
        ...prev,
        { ingredient, quantityInGrams: 100 },
      ]);
  }

  // const fakeIngredientLine: IngredientLineDTO = {
  //   id: 'temp-id',
  //   ingredient: ingredients[0],
  //   quantityInGrams: 100,
  //   calories: 200,
  //   protein: 10,
  //   createdAt: '2024-01-01T00:00:00Z',
  //   updatedAt: '2024-01-01T00:00:00Z',
  // };

  return (
    <Form submitText="Crear receta">
      <Form.FormRow label="">
        {ingredientsAndQuantities.length ? ingredientsAndQuantities.length : ''}{' '}
        Ingredientes
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
            !!ingredientsAndQuantities.find(
              (iq) => iq.ingredient.id === ingredient.id
            )
          }
          onClick={() => selectIngredient(ingredient)}
        />
      ))}

      <Form.FormRow label="">
        {/* <IngredientLineItem ingredientLine={fakeIngredientLine} /> */}
      </Form.FormRow>
    </Form>
  );
}

export default NewRecipeForm;
