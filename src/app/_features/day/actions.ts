'use server';
import { AssembledDayDTO } from '@/application-layer/dtos/DayDTO';
import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';
import { AppGetAssembledDayById } from '@/interface-adapters/app/use-cases/day';
import { AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays } from '@/interface-adapters/app/use-cases/day';
import { AppGetMultipleAssembledDaysByIds } from '@/interface-adapters/app/use-cases/day';
import { AppRemoveMealFromDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { AppReplaceFakeMealByAnotherFakeMealForUserInDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { AppReplaceFakeMealByMealForUserInDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { AppReplaceMealByAnotherMealForUserInDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { AppReplaceMealByFakeMealForUserInDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { AppUpdateUserWeightForDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

export type AssembledDayResult = {
  dayId: string;
  assembledDay: AssembledDayDTO | null;
};

export async function getAssembledDayById(
  dayId: string,
): Promise<AssembledDayResult> {
  // TODO handle errors
  const assembledDay = await AppGetAssembledDayById.execute({
    dayId,
    userId: await getCurrentUserId(),
  });

  return {
    dayId,
    assembledDay,
  };
}

export async function getAssembledDaysByIds(
  dayIds: string[],
): Promise<AssembledDayResult[]> {
  // TODO handle errors
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

  return assembledDaysResults;
}

export async function removeMealFromDay(
  dayId: string,
  mealId: string,
): Promise<void> {
  await AppRemoveMealFromDayUsecase.execute({
    dayId: dayId,
    userId: await getCurrentUserId(),
    mealId,
  });

  revalidatePath(`/app/meals`);
  revalidatePath(`/app`);
}

export async function replaceFakeMealByMealForUserInDay(
  fakeMealIdToReplace: string,
  recipeId: string,
  dayId: string,
): Promise<void> {
  await AppReplaceFakeMealByMealForUserInDayUsecase.execute({
    dayId,
    userId: await getCurrentUserId(),
    fakeMealIdToReplace,
    recipeId,
  });

  revalidatePath(`/app/meals`);
  revalidatePath(`/app`);
}

export async function replaceMealByAnotherMealForUserInDay(
  mealToReplaceId: string,
  recipeId: string,
  dayId: string,
): Promise<void> {
  await AppReplaceMealByAnotherMealForUserInDayUsecase.execute({
    dayId,
    userId: await getCurrentUserId(),
    mealToReplaceId,
    recipeId,
  });

  revalidatePath(`/app/meals`);
  revalidatePath(`/app`);
}

export async function replaceMealByFakeMealForUserInDay(
  mealIdToReplace: string,
  name: string,
  calories: number,
  protein: number,
  dayId: string,
): Promise<void> {
  await AppReplaceMealByFakeMealForUserInDayUsecase.execute({
    dayId,
    userId: await getCurrentUserId(),
    mealIdToReplace,
    name,
    calories,
    protein,
  });

  revalidatePath(`/app/meals`);
  revalidatePath(`/app`);
}

export async function replaceFakeMealByAnotherFakeMealForUserInDay(
  fakeMealIdToReplace: string,
  name: string,
  calories: number,
  protein: number,
  dayId: string,
): Promise<void> {
  await AppReplaceFakeMealByAnotherFakeMealForUserInDayUsecase.execute({
    dayId,
    userId: await getCurrentUserId(),
    fakeMealIdToReplace,
    name,
    calories,
    protein,
  });

  revalidatePath(`/app/meals`);
  revalidatePath(`/app`);
}

export async function updateUserWeightForDay(
  dayId: string,
  newWeightInKg: number,
): Promise<void> {
  await AppUpdateUserWeightForDayUsecase.execute({
    dayId,
    userId: await getCurrentUserId(),
    newWeightInKg,
  });

  revalidatePath(`/app`);
}

export async function getLastNumberOfDaysIncludingToday(
  numberOfDays: number,
): Promise<DayEntry[]> {
  return await AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays.execute(
    {
      numberOfDays,
      userId: await getCurrentUserId(),
    },
  );
}
