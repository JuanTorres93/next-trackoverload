import { AppAddMealToDayUsecase } from '@/interface-adapters/app/use-cases/day';
import type { NextRequest } from 'next/server';

export async function POST(_req: NextRequest) {
  try {
    const body = await _req.json();
    const { dayId, userId, recipeId } = body;

    await AppAddMealToDayUsecase.execute({
      dayId,
      userId,
      recipeId,
    });

    return Response.json(
      { message: 'Meal added successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.log('app/api/day/addMeal: Error adding meal to day:', error);
    return Response.json(
      { error: 'Failed to add meal to day' },
      { status: 500 },
    );
  }
}
