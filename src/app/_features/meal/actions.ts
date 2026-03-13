'use server';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { AppToggleIsEatenUsecase } from '@/interface-adapters/app/use-cases/meal';
import { revalidatePath } from 'next/cache';

export async function toggleIsEaten(mealId: string): Promise<void> {
  await AppToggleIsEatenUsecase.execute({
    mealId,
    userId: await getCurrentUserId(),
  });

  revalidatePath('/app');
}
