'use server';
import { AssembledDayDTO } from '@/application-layer/dtos/DayDTO';
import { AppGetAssembledDayById } from '@/interface-adapters/app/use-cases/day';
import { AppGetMultipleAssembledDaysByIds } from '@/interface-adapters/app/use-cases/day';
import { AppRemoveMealFromDayUsecase } from '@/interface-adapters/app/use-cases/day';
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
}
