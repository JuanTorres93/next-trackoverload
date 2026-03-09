'use server';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { AppGetAllMealsInDayForUserUsecase } from '@/interface-adapters/app/use-cases/meal';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

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
