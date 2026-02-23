import { AppAddMultipleMealsToDayUsecase } from '@/interface-adapters/app/use-cases/day';
import type { NextRequest } from 'next/server';

export async function POST(_req: NextRequest) {
  try {
    const body = await _req.json();
    const { dayId, userId, recipeIds } = body;

    await AppAddMultipleMealsToDayUsecase.execute({
      dayId,
      userId,
      recipeIds,
    });

    return Response.json(
      { message: 'Meals added successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.log(
      'app/api/day/addMultipleMeals: Error adding meals to day:',
      error,
    );
    return Response.json(
      { error: 'Failed to add meals to day' },
      { status: 500 },
    );
  }
}
