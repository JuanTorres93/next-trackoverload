'use server';
import {
  AppAddIngredientToRecipeUsecase,
  AppCreateRecipeUsecase,
  AppDeleteRecipeUsecase,
  AppDuplicateRecipeUsecase,
  AppRemoveIngredientFromRecipeUsecase,
  AppUpdateRecipeUsecase,
} from '@/interface-adapters/app/use-cases/recipe';

import { FormState } from '@/app/_types/FormState';
import { initialFormState } from '@/app/_utils/form/forms';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { IngredientLineInfo } from '@/application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';

export async function createRecipe(
  initialState: FormState, // Unsed, but needed for useActionState
  formData: FormData
) {
  const finalFormState: FormState = initialFormState();

  const userId = String(formData.get('userId') || '').trim();
  const name = String(formData.get('name') || '').trim();
  const ingredientLinesInfoStr = String(
    formData.get('ingredientLinesInfo') || '[]'
  );

  // extract image if exists
  const imageFile = formData.get('image') as File | null;
  let imageBuffer: Buffer | undefined;

  if (imageFile && imageFile.size > 0) {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } catch {
      finalFormState.message = 'Error al procesar la imagen';
      return finalFormState;
    }
  }

  let ingredientLinesInfo: IngredientLineInfo[] = [];

  try {
    ingredientLinesInfo = JSON.parse(ingredientLinesInfoStr);
  } catch {
    // TODO mejor mensaje de error
    finalFormState.message = 'Error al leer las líneas de ingredientes';
    return finalFormState;
  }

  const errors: Record<string, string> = {};
  if (ingredientLinesInfo.length === 0)
    errors.ingredientLines = 'Se requiere al menos un ingrediente';

  if (Object.keys(errors).length > 0) {
    finalFormState.errors = errors;
    finalFormState.message = 'Revisa los campos';
    return finalFormState;
  }

  try {
    // TODO IMPORTANT: ensure userId is the current logged in user
    const request = {
      actorUserId: userId,
      targetUserId: userId,
      name,
      ingredientLinesInfo,
      imageBuffer,
    };
    await AppCreateRecipeUsecase.execute(request);
  } catch {
    finalFormState.message = 'Error al crear la receta';
    return finalFormState;
  }

  finalFormState.ok = true;
  finalFormState.message = 'Receta creada';
  // return finalFormState;

  redirect('/app/recipes');
}

export async function deleteRecipe(recipeId: string) {
  await AppDeleteRecipeUsecase.execute({
    userId: 'dev-user', // TODO get current user id
    id: recipeId,
  });

  revalidatePath('/app/recipes');
  redirect('/app/recipes/');
}

export async function removeIngredientFromRecipe(
  recipeId: string,
  ingredientId: string
) {
  await AppRemoveIngredientFromRecipeUsecase.execute({
    recipeId,
    userId: 'dev-user', // TODO get current user id
    ingredientId,
  });

  revalidatePath(`/app/recipes`);
  revalidatePath(`/app/recipes/${recipeId}`);
}

export async function duplicateRecipe(recipeId: string, newName?: string) {
  const duplicatedRecipe = await AppDuplicateRecipeUsecase.execute({
    userId: 'dev-user', // TODO get current user id
    recipeId,
    ...(newName && { newName }),
  });

  revalidatePath('/app/recipes');
  redirect(`/app/recipes/${duplicatedRecipe.id}`);
}

export async function renameRecipe(recipeId: string, newName: string) {
  const updatedRecipe = await AppUpdateRecipeUsecase.execute({
    userId: 'dev-user', // TODO get current user id
    id: recipeId,
    name: newName,
  });

  revalidatePath('/app/recipes');
  revalidatePath(`/app/recipes/${updatedRecipe.id}`);
}

export async function addIngredientToRecipe(
  recipeId: string,
  externalIngredientId: string,
  source: string,
  name: string,
  caloriesPer100g: number,
  proteinPer100g: number,
  imageUrl: string | undefined,
  quantityInGrams: number
) {
  await AppAddIngredientToRecipeUsecase.execute({
    userId: 'dev-user', // TODO get current user id
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
