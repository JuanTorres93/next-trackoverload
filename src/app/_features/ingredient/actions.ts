'use server';
import { AppUpdateIngredientLineUsecase } from '@/interface-adapters/app/use-cases/ingredientline';
import { revalidatePath } from 'next/cache';

export async function updateIngredientLineQuantity(
  parentEntityType: 'recipe' | 'meal',
  parentEntityId: string,
  ingredientLineId: string,
  newQuantityInGrams: number,
) {
  await AppUpdateIngredientLineUsecase.execute({
    userId: 'dev-user', // TODO: get current user id from session
    parentEntityType,
    parentEntityId,
    ingredientLineId,
    quantityInGrams: newQuantityInGrams,
  });

  revalidatePath(`/app/${parentEntityType}s/${parentEntityId}`);
  revalidatePath(`/app/${parentEntityType}s`);
}
