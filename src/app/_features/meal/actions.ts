'use server';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import {
  AppGetAllMealsInDayForUserUsecase,
  AppToggleIsEatenUsecase,
} from '@/interface-adapters/app/use-cases/meal';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { revalidatePath } from 'next/cache';

export async function getAllMealsInDayForUser(
  dayId: string,
): Promise<MealDTO[]> {
  let mealDTOs: MealDTO[];

  try {
    mealDTOs = await AppGetAllMealsInDayForUserUsecase.execute({
      dayId,
      userId: await getCurrentUserId(),
    });
  } catch {
    mealDTOs = [];
  }

  return mealDTOs;
}

export async function toggleIsEaten(mealId: string): Promise<void> {
  await AppToggleIsEatenUsecase.execute({
    mealId,
    userId: await getCurrentUserId(),
  });

  revalidatePath('/app');
}
