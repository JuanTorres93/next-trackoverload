"use server";
import { refresh, revalidatePath } from "next/cache";

import { AssembledDayDTO, DayDTO, DayEntry, JSENDResponse } from "shared";

import {
  AppAddMultipleMealsToDayUsecase,
  AppAddMultipleMealsToMultipleDaysUsecase,
  AppGetAssembledDayById,
  AppGetLastDayWithCaloriesGoalForUserUsecase,
  AppGetLastDayWithProteinGoalForUserUsecase,
  AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays,
  AppGetMultipleAssembledDaysByIds,
  AppGetWeightFeedbackForLastNDaysUsecase,
  AppRemoveMealFromDayUsecase,
  AppSetCaloriesGoalForDayAndUserUsecase,
  AppSetProteinGoalForDayAndUserUsecase,
  AppUpdateUserWeightForDayUsecase,
} from "../../../interface-adapters/app/use-cases/day";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";

export type AssembledDayResult = {
  dayId: string;
  assembledDay: AssembledDayDTO | null;
};

export async function getAssembledDayById(
  dayId: string,
): Promise<JSENDResponse<AssembledDayResult>> {
  try {
    const assembledDay = await AppGetAssembledDayById.execute({
      dayId,
      userId: await getCurrentUserId(),
    });

    return {
      status: "success",
      data: {
        dayId,
        assembledDay,
      },
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function getAssembledDaysByIds(
  dayIds: string[],
): Promise<JSENDResponse<AssembledDayResult[]>> {
  try {
    const assembledDays = await AppGetMultipleAssembledDaysByIds.execute({
      dayIds,
      userId: await getCurrentUserId(),
    });

    const assembledDaysMap = new Map<string, AssembledDayDTO>();
    assembledDays.forEach((day) => assembledDaysMap.set(day.id, day));

    const assembledDaysResults: AssembledDayResult[] = dayIds.map((dayId) => ({
      dayId,
      assembledDay: assembledDaysMap.get(dayId) || null,
    }));

    return {
      status: "success",
      data: assembledDaysResults,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

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

export async function getLastNumberOfDaysIncludingTodayAndNonExistingDays(
  numberOfDays: number,
): Promise<JSENDResponse<DayEntry[]>> {
  try {
    const dayEntries =
      await AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays.execute(
        {
          numberOfDays,
          userId: await getCurrentUserId(),
        },
      );

    return {
      status: "success",
      data: dayEntries,
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

export async function getLastDayWithCaloriesGoalForUser(): Promise<
  JSENDResponse<DayDTO | null>
> {
  try {
    const lastDay = await AppGetLastDayWithCaloriesGoalForUserUsecase.execute({
      userId: await getCurrentUserId(),
    });

    return {
      status: "success",
      data: lastDay,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
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
    revalidatePath(`/app/weight`);

    return {
      status: "success",
      data: undefined,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function getLastDayWithProteinGoalForUser(): Promise<
  JSENDResponse<DayDTO | null>
> {
  try {
    const lastDay = await AppGetLastDayWithProteinGoalForUserUsecase.execute({
      userId: await getCurrentUserId(),
    });

    return {
      status: "success",
      data: lastDay,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function setProteinGoalForDay(
  dayId: string,
  newProteinGoal: number,
): Promise<JSENDResponse<void>> {
  try {
    await AppSetProteinGoalForDayAndUserUsecase.execute({
      dayId,
      userId: await getCurrentUserId(),
      newProteinGoal,
    });

    revalidatePath(`/app`);
    revalidatePath(`/app/weight`);

    return {
      status: "success",
      data: undefined,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function getWeightFeedbackForLastNDays(
  numberOfDays: number,
): Promise<JSENDResponse<string>> {
  try {
    const feedback = await AppGetWeightFeedbackForLastNDaysUsecase.execute({
      numberOfDays,
      userId: await getCurrentUserId(),
    });

    return {
      status: "success",
      data: feedback,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}
