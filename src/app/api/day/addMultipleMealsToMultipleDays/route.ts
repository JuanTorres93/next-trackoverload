import { AppAddMultipleMealsToMultipleDaysUsecase } from '@/interface-adapters/app/use-cases/day';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { JSENDResponse } from '@/app/_types/JSEND';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<JSENDResponse<{ message: string }>>> {
  try {
    const promises = [request.json(), getCurrentUserId()];

    const [body, userId] = await Promise.all(promises);

    const { dayIds, recipeIds } = body;

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
      { status: 'fail', data: { message: 'Failed to add meals to days' } },
      { status: 500 },
    );
  }
}
