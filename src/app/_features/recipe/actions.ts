'use server';
import {
  AppAddIngredientToRecipeUsecase,
  AppCreateRecipeUsecase,
  AppDeleteRecipeUsecase,
  AppDuplicateRecipeUsecase,
  AppGetAllRecipesForUserUsecase,
  AppRemoveIngredientFromRecipeUsecase,
  AppUpdateRecipeImageUsecase,
  AppUpdateRecipeUsecase,
} from '@/interface-adapters/app/use-cases/recipe';

import { CreateIngredientLineData } from '@/application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

export async function getAllRecipesForLoggedInUser() {
  const userId = await getCurrentUserId();
  const recipes: RecipeDTO[] = await AppGetAllRecipesForUserUsecase.execute({
    actorUserId: userId,
    targetUserId: userId,
  });

  return recipes;
}

export async function createRecipe({
  name,
  ingredientLinesInfo,
  imageFile,
}: {
  name: string;
  ingredientLinesInfo: CreateIngredientLineData[];
  imageFile?: File;
}) {
  const userId = await getCurrentUserId();
  let imageBuffer: Buffer | undefined;

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  }

  try {
    const request = {
      actorUserId: userId,
      targetUserId: userId,
      name,
      ingredientLinesInfo,
      imageBuffer,
    };
    await AppCreateRecipeUsecase.execute(request);
  } catch {
    // TODO handle error properly
    return;
  }

  redirect('/app/recipes');
}

export async function deleteRecipe(recipeId: string) {
  await AppDeleteRecipeUsecase.execute({
    userId: await getCurrentUserId(),
    id: recipeId,
  });

  revalidatePath('/app/recipes');
  redirect('/app/recipes/');
}

export async function removeIngredientFromRecipe(
  recipeId: string,
  ingredientId: string,
) {
  await AppRemoveIngredientFromRecipeUsecase.execute({
    recipeId,
    userId: await getCurrentUserId(),
    ingredientId,
  });

  revalidatePath(`/app/recipes`);
  revalidatePath(`/app/recipes/${recipeId}`);
}

export async function duplicateRecipe(recipeId: string, newName?: string) {
  const duplicatedRecipe = await AppDuplicateRecipeUsecase.execute({
    userId: await getCurrentUserId(),
    recipeId,
    ...(newName && { newName }),
  });

  revalidatePath('/app/recipes');
  redirect(`/app/recipes/${duplicatedRecipe.id}`);
}

export async function renameRecipe(recipeId: string, newName: string) {
  const updatedRecipe = await AppUpdateRecipeUsecase.execute({
    userId: await getCurrentUserId(),
    id: recipeId,
    name: newName,
  });

  revalidatePath('/app/recipes');
  revalidatePath(`/app/recipes/${updatedRecipe.id}`);
}

export async function updateRecipeImage(
  recipeId: string,
  imageFile: File | null,
) {
  if (!imageFile) return;
  if (imageFile.size <= 0) return;

  const arrayBuffer = await imageFile.arrayBuffer();
  const imageBuffer: Buffer = Buffer.from(arrayBuffer);

  await AppUpdateRecipeImageUsecase.execute({
    userId: await getCurrentUserId(),
    recipeId,
    imageData: imageBuffer,
  });

  revalidatePath(`/app/recipes`);
  revalidatePath(`/app/recipes/${recipeId}`);
}

export async function addIngredientToRecipe(
  recipeId: string,
  externalIngredientId: string,
  source: string,
  name: string,
  caloriesPer100g: number,
  proteinPer100g: number,
  imageUrl: string | undefined,
  quantityInGrams: number,
) {
  await AppAddIngredientToRecipeUsecase.execute({
    userId: await getCurrentUserId(),
    recipeId,
    externalIngredientId: externalIngredientId,
    source: source,
    name: name,
    caloriesPer100g: caloriesPer100g,
    proteinPer100g: proteinPer100g,
    imageUrl: imageUrl,
    quantityInGrams,
  });

  revalidatePath(`/app/recipes/${recipeId}`);
}
