"use server";
import { revalidatePath } from "next/cache";

import { JSENDResponse } from "shared";

import { AppToggleIsEatenUsecase } from "../../../interface-adapters/app/use-cases/meal";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";

export async function toggleIsEaten(
  mealId: string,
): Promise<JSENDResponse<void>> {
  try {
    await AppToggleIsEatenUsecase.execute({
      mealId,
      userId: await getCurrentUserId(),
    });

    revalidatePath("/app");

    return {
      status: "success",
      data: undefined,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}
