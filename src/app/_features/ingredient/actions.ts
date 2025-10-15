'use server';
import { AppCreateIngredientUsecase } from '@/interface-adapters/app/use-cases/ingredient/CreateIngredient/createingredient';

export async function createIngredient(data: FormData) {
  // TODO DELETE THESE DEBUG LOGS
  console.log('data');
  console.log(data);

  const name = data.get('name')?.toString();
  const calories = data.get('calories')?.toString();
  const protein = data.get('protein')?.toString();

  const ingredient = await AppCreateIngredientUsecase.execute({
    name,
    calories,
    protein,
  });

  // TODO DELETE THESE DEBUG LOGS
  console.log('ingredient');
  console.log(ingredient);
}
