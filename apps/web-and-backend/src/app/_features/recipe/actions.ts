"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { JSENDResponse } from "@/app/_types/JSEND";

import { RecipeDTO } from "../../../application-layer/dtos/RecipeDTO";
import { CreateIngredientLineData } from "../../../application-layer/use-cases/recipe/common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo";
import {
  AppAddIngredientToRecipeUsecase,
  AppCreateRecipeUsecase,
  AppDeleteRecipeUsecase,
  AppDuplicateRecipeUsecase,
  AppGetAllRecipesForUserUsecase,
  AppGetRecipeByIdForUserUsecase,
  AppRemoveIngredientFromRecipeUsecase,
  AppUpdateRecipeImageUsecase,
  AppUpdateRecipeUsecase,
} from "../../../interface-adapters/app/use-cases/recipe";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";
import { isNextRedirectError } from "../common/handleNextRedirectError";

export async function getAllRecipesForLoggedInUser(): Promise<
  JSENDResponse<RecipeDTO[]>
> {
  try {
    const userId = await getCurrentUserId();
    const recipes: RecipeDTO[] = await AppGetAllRecipesForUserUsecase.execute({
      actorUserId: userId,
      targetUserId: userId,
    });

    return {
      status: "success",
      data: recipes,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function getRecipeByIdForLoggedInUser(
  recipeId: string,
): Promise<JSENDResponse<RecipeDTO | null>> {
  try {
    const userId = await getCurrentUserId();

    const recipe: RecipeDTO | null =
      await AppGetRecipeByIdForUserUsecase.execute({
        id: recipeId,
        userId,
      });

    return {
      status: "success",
      data: recipe,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function createRecipe({
  name,
  ingredientLinesInfo,
  imageFile,
}: {
  name: string;
  ingredientLinesInfo: CreateIngredientLineData[];
  imageFile?: File;
}): Promise<JSENDResponse<void>> {
  let imageBuffer: Buffer | undefined;

  try {
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();

      imageBuffer = Buffer.from(arrayBuffer);
    }
  } catch {
    return {
      status: "fail",
      data: {
        message: "Error al procesar la imagen. Vuelve a intentarlo.",
      },
    };
  }

  try {
    const userId = await getCurrentUserId();

    const request = {
      actorUserId: userId,
      targetUserId: userId,
      name,
      ingredientLinesInfo,
      imageBuffer,
    };

    await AppCreateRecipeUsecase.execute(request);

    redirect("/app/recipes");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;

    return handleActionErrors(error as Error);
  }
}

export async function deleteRecipe(
  recipeId: string,
): Promise<JSENDResponse<void>> {
  try {
    await AppDeleteRecipeUsecase.execute({
      userId: await getCurrentUserId(),
      id: recipeId,
    });

    revalidatePath("/app/recipes");
    redirect("/app/recipes/");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;

    return handleActionErrors(error as Error);
  }
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

  revalidatePath("/app/recipes");
  redirect(`/app/recipes/${duplicatedRecipe.id}`);
}

export async function renameRecipe(recipeId: string, newName: string) {
  const updatedRecipe = await AppUpdateRecipeUsecase.execute({
    userId: await getCurrentUserId(),
    id: recipeId,
    name: newName,
  });

  revalidatePath("/app/recipes");
  revalidatePath(`/app/recipes/${updatedRecipe.id}`);
}

export async function updateRecipeImage(
  recipeId: string,
  imageFile: File | null,
) {
  if (!imageFile) return;
  if (imageFile.size <= 0) return;

  const promises = [imageFile.arrayBuffer(), getCurrentUserId()] as const;

  const [arrayBuffer, userId] = await Promise.all(promises);

  const imageBuffer: Buffer = Buffer.from(arrayBuffer);

  await AppUpdateRecipeImageUsecase.execute({
    userId,
    recipeId,
    imageData: imageBuffer,
  });

  revalidatePath(`/app`);
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
