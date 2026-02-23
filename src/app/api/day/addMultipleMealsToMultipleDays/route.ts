import { AppAddMultipleMealsToMultipleDaysUsecase } from '@/interface-adapters/app/use-cases/day';
import type { NextRequest } from 'next/server';

export async function POST(_req: NextRequest) {
  try {
    const body = await _req.json();
    const { dayIds, userId, recipeIds } = body;

    const result = await AppAddMultipleMealsToMultipleDaysUsecase.execute({
      dayIds,
      userId,
      recipeIds,
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.log(
      'app/api/day/addMultipleMealsToMultipleDays: Error adding meals to days:',
      error,
    );
    return Response.json(
      { error: 'Failed to add meals to days' },
      { status: 500 },
    );
  }
}
