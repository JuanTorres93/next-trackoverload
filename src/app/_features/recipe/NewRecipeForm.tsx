import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import IngredientLineItem from '../ingredient/IngredientLineItem';

// TODO IMPORTANT use search functionality to select ingredients
import { AppGetAllIngredientsUsecase } from '@/interface-adapters/app/use-cases/ingredient';

async function NewRecipeForm() {
  // TODO IMPORTANT use search functionality to select ingredients
  const ingredients = await AppGetAllIngredientsUsecase.execute();

  const fakeIngredientLine: IngredientLineDTO = {
    id: 'temp-id',
    ingredient: ingredients[0],
    quantityInGrams: 100,
    calories: 200,
    protein: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  return (
    <form action="">
      <IngredientLineItem ingredientLine={fakeIngredientLine} />
    </form>
  );
}

export default NewRecipeForm;
