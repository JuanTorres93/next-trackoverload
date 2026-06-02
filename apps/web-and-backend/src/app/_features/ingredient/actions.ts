"use server";
import { revalidatePath } from "next/cache";

import { IngredientLineDTO } from "shared";
import { JSENDResponse } from "shared";

import { AppUpdateIngredientLineUsecase } from "../../../interface-adapters/app/use-cases/ingredientline";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";

export async function updateIngredientLineQuantity(
  parentEntityType: "recipe" | "meal",
  parentEntityId: string,
  ingredientLineId: string,
  newQuantityInGrams: number,
): Promise<JSENDResponse<IngredientLineDTO>> {
  try {
    const updatedIngredientLine = await AppUpdateIngredientLineUsecase.execute({
      userId: await getCurrentUserId(),
      parentEntityType,
      parentEntityId,
      ingredientLineId,
      quantityInGrams: newQuantityInGrams,
    });

    revalidatePath(`/app/${parentEntityType}s/${parentEntityId}`);
    revalidatePath(`/app/${parentEntityType}s`);

    return {
      status: "success",
      data: updatedIngredientLine,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}
