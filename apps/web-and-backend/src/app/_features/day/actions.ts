"use server";
import { refresh, revalidatePath } from "next/cache";

import { JSENDResponse } from "@/app/_types/JSEND";

import {
  AppAddMultipleMealsToDayUsecase,
  AppAddMultipleMealsToMultipleDaysUsecase,
  AppRemoveMealFromDayUsecase,
  AppSetCaloriesGoalForDayAndUserUsecase,
  AppUpdateUserWeightForDayUsecase,
} from "../../../interface-adapters/app/use-cases/day";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";

export async function removeMealFromDay(
  dayId: string,
  mealId: string,
): Promise<JSENDResponse<void>> {
  try {
    await AppRemoveMealFromDayUsecase.execute({
      dayId: dayId,
      userId: await getCurrentUserId(),
      mealId,
    });

    revalidatePath(`/app`);
    revalidatePath(`/app/meals`);

    return {
      status: "success",
      data: undefined,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  } finally {
    refresh();
  }
}

export async function updateUserWeightForDay(
  dayId: string,
  newWeightInKg: number,
): Promise<JSENDResponse<void>> {
  try {
    await AppUpdateUserWeightForDayUsecase.execute({
      dayId,
      userId: await getCurrentUserId(),
      newWeightInKg,
    });

    revalidatePath(`/app`);

    return {
      status: "success",
      data: undefined,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function addMealsToDay(
  dayId: string,
  recipeIds: string[],
): Promise<JSENDResponse<void>> {
  try {
    await AppAddMultipleMealsToDayUsecase.execute({
      dayId,
      recipeIds,
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
  } finally {
    refresh();
  }
}

export async function addMealsToMultipleDays(
  dayIds: string[],
  recipeIds: string[],
): Promise<JSENDResponse<void>> {
  try {
    await AppAddMultipleMealsToMultipleDaysUsecase.execute({
      dayIds,
      recipeIds,
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
  } finally {
    refresh();
  }
}

export async function setCaloriesGoalForDay(
  dayId: string,
  newCaloriesGoal: number,
): Promise<JSENDResponse<void>> {
  try {
    await AppSetCaloriesGoalForDayAndUserUsecase.execute({
      dayId,
      userId: await getCurrentUserId(),
      newCaloriesGoal,
    });

    revalidatePath(`/app`);

    return {
      status: "success",
      data: undefined,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}
