import { AppAddMultipleMealsToMultipleDaysUsecase } from '@/interface-adapters/app/use-cases/day';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { JSENDResponse } from '@/app/_types/JSEND';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<JSENDResponse<{ message: string }>>> {
  try {
    const body = await request.json();
    const { dayIds, recipeIds } = body;
    const userId = await getCurrentUserId();

    await AppAddMultipleMealsToMultipleDaysUsecase.execute({
      dayIds,
      userId,
      recipeIds,
    });

    return NextResponse.json(
      {
        status: 'success',
        data: {
          message: 'Meals added successfully to multiple days',
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(
      'app/api/day/addMultipleMealsToMultipleDays: Error adding meals to days:',
      error,
    );
    return NextResponse.json(
      { status: 'error', message: 'Failed to add meals to days' },
      { status: 500 },
    );
  }
}
