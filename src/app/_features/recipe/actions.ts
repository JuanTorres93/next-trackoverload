'use server';
import { AppCreateRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { AppDeleteRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { AppRemoveIngredientFromRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { AppDuplicateRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { AppUpdateRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { AppAddIngredientToRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';

import { FormState } from '@/app/_types/FormState';
import { initialFormState } from '@/app/_utils/form/forms';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  fromIngredientLineDTO,
  IngredientLineDTO,
} from '@/application-layer/dtos/IngredientLineDTO';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';

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

  let ingredientLinesInfo: { ingredientId: string; quantityInGrams: number }[] =
    [];

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
    const request = {
      userId,
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
  ingredientLineDTO: IngredientLineDTO
) {
  const ingredientLine: IngredientLine =
    fromIngredientLineDTO(ingredientLineDTO);

  await AppAddIngredientToRecipeUsecase.execute({
    userId: 'dev-user', // TODO get current user id
    recipeId,
    ingredientLine,
  });

  revalidatePath(`/app/recipes/${recipeId}`);
}
