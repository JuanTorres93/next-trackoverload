'use server';
import { revalidatePath } from 'next/cache';

import { AppAddFakeMealToDayUsecase } from '@/interface-adapters/app/use-cases/day';

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
    userId: 'dev-user', // TODO IMPORTANT Change when authentication is implemented.
  });

  revalidatePath(`/app/meals`);
}
