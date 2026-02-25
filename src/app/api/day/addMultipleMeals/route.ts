import { AppAddMultipleMealsToDayUsecase } from '@/interface-adapters/app/use-cases/day';
import type { NextRequest } from 'next/server';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();

    if (!text) {
      return Response.json(
        { error: 'Request body is required' },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { dayId, recipeIds } = body;

    const userId = await getCurrentUserId();

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
