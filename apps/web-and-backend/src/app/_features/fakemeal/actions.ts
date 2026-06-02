"use server";
import { revalidatePath } from "next/cache";

import { JSENDResponse } from "shared";

import { AppAddFakeMealToDayUsecase } from "../../../interface-adapters/app/use-cases/day";
import { AppRemoveFakeMealFromDayUsecase } from "../../../interface-adapters/app/use-cases/day/AppRemoveFakeMealFromDayUsecase";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";

export async function addFakeMealToDay(
  dayId: string,
  name: string,
  calories: number,
  protein: number,
): Promise<JSENDResponse<void>> {
  try {
    await AppAddFakeMealToDayUsecase.execute({
      dayId,
      name,
      calories,
      protein,
      userId: await getCurrentUserId(),
    });

    revalidatePath(`/app`);
    revalidatePath(`/app/meals`);

    return {
      status: "success",
      data: undefined,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function removeFakeMealFromDay(
  dayId: string,
  fakeMealId: string,
): Promise<JSENDResponse<void>> {
  try {
    await AppRemoveFakeMealFromDayUsecase.execute({
      dayId,
      fakeMealId,
      userId: await getCurrentUserId(),
    });

    revalidatePath(`/app`);
    revalidatePath(`/app/meals`);

    return {
      status: "success",
      data: undefined,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}
