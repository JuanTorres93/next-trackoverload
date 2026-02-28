import { AppAddMultipleMealsToDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { JSENDResponse } from '@/app/_types/JSEND';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<JSENDResponse<{ message: string }>>> {
  try {
    const body = await request.json();

    const { dayId, recipeIds } = body;

    const userId = await getCurrentUserId();

    await AppAddMultipleMealsToDayUsecase.execute({
      dayId,
      userId,
      recipeIds,
    });

    return NextResponse.json(
      {
        status: 'success',
        data: {
          message: 'Meals added successfully',
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(
      'app/api/day/addMultipleMeals: Error adding meals to day:',
      error,
    );
    return NextResponse.json(
      { status: 'error', message: 'Failed to add meals to day' },
      { status: 500 },
    );
  }
}
