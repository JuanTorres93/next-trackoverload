'use server';
import { AppUpdateIngredientLineUsecase } from '@/interface-adapters/app/use-cases/ingredientline';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

export async function updateIngredientLineQuantity(
  parentEntityType: 'recipe' | 'meal',
  parentEntityId: string,
  ingredientLineId: string,
  newQuantityInGrams: number,
) {
  await AppUpdateIngredientLineUsecase.execute({
    userId: await getCurrentUserId(),
    parentEntityType,
    parentEntityId,
    ingredientLineId,
    quantityInGrams: newQuantityInGrams,
  });

  revalidatePath(`/app/${parentEntityType}s/${parentEntityId}`);
  revalidatePath(`/app/${parentEntityType}s`);
}
