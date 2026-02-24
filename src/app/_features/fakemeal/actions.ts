'use server';
import { revalidatePath } from 'next/cache';

import { AppAddFakeMealToDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { AppRemoveFakeMealFromDayUsecase } from '@/interface-adapters/app/use-cases/day/RemoveFakeMealFromDay/removeFakeMealFromDay';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

export async function addFakeMealToDay(
  dayId: string,
  name: string,
  calories: number,
  protein: number,
): Promise<void> {
  await AppAddFakeMealToDayUsecase.execute({
    dayId,
    name,
    calories,
    protein,
    userId: await getCurrentUserId(),
  });

  revalidatePath(`/app/meals`);
}

export async function removeFakeMealFromDay(
  dayId: string,
  fakeMealId: string,
): Promise<void> {
  await AppRemoveFakeMealFromDayUsecase.execute({
    dayId,
    fakeMealId,
    userId: await getCurrentUserId(),
  });

  revalidatePath(`/app/meals`);
}
